import { presetData } from "../presets/coordinates"
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
}

export class Mirror {
    private canvas: Canvas
    private object: LineGroup
    private reflection: LineGroup
    private controlEl: MirrorControlElements

    public constructor(params: MirrorConstructorParameters)
    {
        this.canvas = params.canvas
        this.object = params.mirrorObject
        this.reflection = this.object.clone()
        this.controlEl = params.controlEl

        this.prepareControlElements()
        this.setupEvents()
        this.draw()
    }
    

    public updateScaleMinimum(minScale: number): void {
    this.controlEl.scale.min = minScale.toString();
    }

    private prepareControlElements(): void
    {
        // Atur range min & max dari input slider
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
        // Ubah nilai skala ketika slider skala digeser
        this.controlEl.scale.addEventListener('input', () => {
            this.object.setScale(parseFloat(this.controlEl.scale.value))
        })

        // Render ulang canvas salah satu slider digeser
        Object.values(this.controlEl).forEach(control => {
            control.addEventListener('input', () => {
                this.draw()
        console.log(this.canvas.getHeight() / 2, this.controlEl.objectY.value)
        // console.log(this.canvas.getWidth() / 2, this.controlEl.objectX.value)
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
        this.canvas.drawText("Object" ,this.getObjectDistance(), this.getObjectHeight(), 15, "12px Arial")
        this.canvas.drawLineGroup(this.object, true)
    }

    private drawReflection(): void
    {
        this.reflection = this.object.clone()
        this.reflection.setX(this.getReflectionDistance())
        this.reflection.setY(this.getReflectionHeight())
        this.reflection.setScale(this.getMagnificationScale() * this.reflection.getScale())
        this.reflection.setColor("red")

        this.canvas.drawLineGroup(this.reflection, true)

        // Add reflection label
        this.canvas.setPenColor("red")
        this.canvas.drawText("Bayangan", this.getReflectionDistance(), this.getReflectionHeight() - 15, "12px Arial")
        this.canvas.resetPenColor()
    }

    private drawFocalPoint(): void
    {
        this.canvas.setPenColor("green")
        this.canvas.drawCircle(this.getFocalDistance(), 0, 4)
        this.canvas.drawText(`F (${this.getFocalDistance()})`, this.getFocalDistance(), 15, "12px Arial")
        this.canvas.resetPenColor()
    }

    private drawLightRays(): void
    {
        const objectTopRays = [
            [
                this.getObjectDistance(),
                this.getObjectHeight(),
                0,
                this.getObjectHeight(),
            ],
            [
                0,
                this.getObjectHeight(),
                this.getReflectionDistance(),
                this.getReflectionHeight(),
            ],
        ]

        const objectBottomRays = [
            [
                this.getObjectDistance(),
                this.getObjectHeight(),
                0,
                this.getReflectionHeight(),
            ],
            [
                0,
                this.getReflectionHeight(),
                this.getReflectionDistance(),
                this.getReflectionHeight(),
            ],
        ]

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

        this.canvas.drawLineGroup(LineGroup.fromCoordinates(objectTopRays, { color: "#FFA725" }))
        this.canvas.drawLineGroup(LineGroup.fromCoordinates(objectBottomRays, { color: "#034C53" }))
        this.canvas.drawLineGroup(LineGroup.fromCoordinates(heightLines))
    }


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


    public updateObject(newObject: LineGroup): void {
        this.object = newObject;
        this.reflection = this.object.clone();
        this.draw();
    }

}