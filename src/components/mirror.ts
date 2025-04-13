import { Canvas } from "./canvas"
import { LineGroup } from "./line-group"

export interface MirrorConstructorParameters {
    canvas: Canvas,
    mirrorObject: LineGroup,

    controlEl: MirrorControlElements,
}

export interface MirrorControlElements {
    scale: HTMLInputElement
    objectX: HTMLInputElement
    objectY: HTMLInputElement
    focalDistance: HTMLInputElement
    simulationType: HTMLInputElement
}

export enum MirrorSimulationType {
    CONCAVE_MIRROR = "concave-mirror",
    CONVEX_LENSE = "convex-lense",
}

export class Mirror {
    private canvas: Canvas
    private object: LineGroup
    private reflection: LineGroup
    private controlEl: MirrorControlElements
    private simulationType: MirrorSimulationType

    public constructor(params: MirrorConstructorParameters)
    {
        this.canvas = params.canvas
        this.object = params.mirrorObject
        this.reflection = this.object.clone()
        this.controlEl = params.controlEl
        this.simulationType = MirrorSimulationType.CONCAVE_MIRROR

        this.prepareControlElements()
        this.setupEvents()
        this.draw()
    }
    

    public updateScaleMinimum(minScale: number): void {
        this.controlEl.scale.min = minScale.toString()
    }

    private prepareControlElements(): void
    {
        this.controlEl.simulationType.value = this.simulationType

        this.controlEl.scale.max = "4"
        
        this.controlEl.scale.step = "0.01"
        this.controlEl.scale.value = this.object.getScale().toString()

        this.controlEl.objectX.max = (this.canvas.getWidth() / 2).toString()
        this.controlEl.objectX.min = (-this.canvas.getWidth() / 2).toString()
        this.controlEl.objectX.value = this.object.getX().toString()

        this.controlEl.objectY.max = (this.canvas.getHeight() / 2).toString()
        this.controlEl.objectY.min = (-this.canvas.getHeight() / 2).toString()
        this.controlEl.objectY.value = this.object.getY().toString()

        this.controlEl.focalDistance.max = (this.canvas.getWidth() / 2).toString()
        this.controlEl.focalDistance.min = (-this.canvas.getWidth() / 2).toString()
        this.controlEl.focalDistance.value = "-200"
    }

    private setupEvents(): void
    {
        // Ubah jenis simulasi ketika input berubah
        this.controlEl.simulationType.addEventListener('input', () => {
            this.simulationType = this.controlEl.simulationType.value as MirrorSimulationType
        })

        // Ubah nilai skala ketika slider skala digeser
        this.controlEl.scale.addEventListener('input', () => {
            this.object.setScale(parseFloat(this.controlEl.scale.value))
        })

        // Render ulang canvas salah satu slider digeser
        Object.values(this.controlEl).forEach(control => {
            control.addEventListener('input', () => {
                this.draw()
            })
        })

        this.canvas.onResize(() => {
            this.prepareControlElements()
            this.draw()
        })
    }

    private draw(): void
    {
        this.canvas.clearCanvas()
        this.drawLightRays()
        this.drawHeightLines()
        this.drawFocalPoint()
        this.drawObject()
        this.drawReflection()
    }

    private drawObject(): void
    {
        // Skip render jika line group masih kosong
        if (!this.object) {
            return
        }

        this.object.setX(this.getObjectDistance())
        this.object.setY(this.getObjectHeight())
        this.object.setColor("blue")
        this.canvas.setPenColor("blue")
        this.canvas.drawText("Object" ,this.getObjectDistance(), this.object.getScale() > 0 ? 16 : -6, "12px Arial", "blue")
        this.canvas.drawLineGroup(this.object, true)
    }

    private drawReflection(): void
    {
        this.reflection = this.object.clone()
        this.reflection.setX(this.getReflectionDistance())
        this.reflection.setY(this.getReflectionHeight())
        this.reflection.setScale(this.getMagnificationScale() * this.reflection.getScale())
        this.reflection.setFlipHorizontal(this.getReflectionDistance() > 0)
        this.reflection.setColor("red")

        this.canvas.drawLineGroup(this.reflection, true)

        // Add reflection label
        this.canvas.setPenColor("red")
        this.canvas.drawText("Bayangan", this.getReflectionDistance(), this.reflection.getScale() > 0 ? 16 : -6, "12px Arial", "red")
        this.canvas.resetPenColor()
    }

    private drawFocalPoint(): void
    {
        this.canvas.setPenColor("green")
        this.canvas.drawCircle(this.getFocalDistance(), 0, 4)
        this.canvas.drawText(`F (${this.getFocalDistance()})`, this.getFocalDistance(), 15, "12px Arial", "green")
        this.canvas.resetPenColor()
    }

    private drawLightRays(): void
    {
        // Top Ray - Object
        const objectTopRayCoordinates = [
            [
                this.getObjectDistance(),
                this.getObjectHeight(),
                0,
                this.getObjectHeight(),
            ],
        ]
        const objectTopRay = LineGroup.fromCoordinates(objectTopRayCoordinates, { color: "#FFA725" })
        this.canvas.drawLineGroup(objectTopRay)

        // Top Ray - Reflection
        this.canvas.drawRayLine({
            x1: 0,
            y1: this.getObjectHeight(),
            x2: this.getReflectionDistance(),
            y2: this.getReflectionHeight(),
            xMax: 0,
            // xMin: this.getReflectionDistance(),
            color: "#FFA725",
        })

        // Bottom Ray - Object
        const objectBottomRayCoordinates = [
            [
                this.getObjectDistance(),
                this.getObjectHeight(),
                0,
                this.getReflectionHeight(),
            ],
        ]
        const objectBottomRay = LineGroup.fromCoordinates(objectBottomRayCoordinates, { color: "#034C53" })
        this.canvas.drawLineGroup(objectBottomRay)

        // Bottom Ray - Reflection
        this.canvas.drawRayLine({
            x1: 0,
            y1: this.getReflectionHeight(),
            x2: this.getReflectionDistance(),
            y2: this.getReflectionHeight(),
            xMax: 0,
            // xMin: this.getReflectionDistance(),
            color: "#034C53",
        })
    }

    public drawHeightLines(): void
    {
        const heightLines = [
            [
                this.getObjectDistance(),
                0,
                this.getObjectDistance(),
                this.getObjectHeight(),
            ],
            [
                this.getReflectionDistance(),
                0,
                this.getReflectionDistance(),
                this.getReflectionHeight(),
            ],
        ]

        this.canvas.drawLineGroup(LineGroup.fromCoordinates(heightLines))
    }

    public updateObject(newObject: LineGroup): void
    {
        this.object = newObject;
        this.reflection = this.object.clone();
        this.draw();
    }

    // --- Getter ---

    private getObjectDistance(): number
    {
        return parseFloat(this.controlEl.objectX.value)
    }

    private getObjectHeight(): number
    {
        return parseFloat(this.controlEl.objectY.value)
    }

    private getFocalDistance(): number
    {
        return parseFloat(this.controlEl.focalDistance.value)
    }

    private getReflectionDistance(): number
    {
        return 1 / (1 / this.getFocalDistance() - 1 / this.getObjectDistance())
    }

    private getReflectionHeight(): number
    {
        return this.getObjectHeight() * this.getMagnificationScale()
    }
    
    public getMagnificationScale(): number
    {
        return -this.getReflectionDistance() / this.getObjectDistance()
    }
}