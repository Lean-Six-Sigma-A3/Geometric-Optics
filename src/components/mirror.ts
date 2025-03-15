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
    focalDistance: HTMLInputElement
}

export class Mirror {
    private canvas: Canvas
    private object: LineGroup
    private controlEl: MirrorControlElements

    public constructor(params: MirrorConstructorParameters)
    {
        this.canvas = params.canvas
        this.object = params.mirrorObject
        this.controlEl = params.controlEl

        this.prepareControlElements()
        this.setupEvents()
        this.draw()
    }

    private prepareControlElements(): void
    {
        // Atur range min & max dari input slider
        this.controlEl.scale.max = "4"
        this.controlEl.scale.min = "1"
        this.controlEl.scale.step = "0.01"
        this.controlEl.scale.value = this.object.getScale().toString()

        this.controlEl.objectX.max = (this.canvas.getWidth() / 2).toString()
        this.controlEl.objectX.min = (-this.canvas.getWidth() / 2).toString()
        this.controlEl.objectX.value = this.object.getX().toString()

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
        this.drawObject()
        this.drawFocalPoint()
        this.drawReflection()
    }

    private drawObject(): void
    {
        // Skip render jika line group masih kosong
        if (!this.object) {
            return
        }

        this.object.setX(this.getObjectDistance())

        this.object.setColor("blue")
        this.canvas.drawLineGroup(this.object)
    }

    private drawReflection(): void
    {
        const reflection = this.object.clone()
        reflection.setX(this.getReflectionDistance())
        reflection.setY(this.getReflectionHeight())
        reflection.setScale(this.getMagnificationScale() * reflection.getScale())
        reflection.setColor("red")

        this.canvas.drawLineGroup(reflection)
    }

    private drawFocalPoint(): void
    {
        this.canvas.setPenColor("green")
        this.canvas.drawCircle(this.getFocalDistance(), 0, 4)
        this.canvas.resetPenColor()
    }

    private getObjectDistance(): number
    {
        return parseFloat(this.controlEl.objectX.value)
    }

    private getObjectHeight(): number
    {
        return this.object.getY()
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