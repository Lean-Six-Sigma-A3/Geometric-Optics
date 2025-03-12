import { Canvas } from "./canvas"
import { LineGroup } from "./line-group"

export interface MirrorConstructorParameters {
    canvas: Canvas,
    mirrorObject?: LineGroup | null,

    controlEl: MirrorControlElements,
}

export interface MirrorControlElements {
    objectX: HTMLInputElement
    scale: HTMLInputElement
}

export class Mirror {
    private canvas: Canvas
    private lineGroup: LineGroup | null
    private controlEl: MirrorControlElements

    public constructor(params: MirrorConstructorParameters)
    {
        this.canvas = params.canvas
        this.lineGroup = params.mirrorObject ?? null
        this.controlEl = params.controlEl

        this.prepareControlElements()
        this.setupEvents()
        this.draw()
    }

    private prepareControlElements(): void
    {
        // Atur range min & max dari input slider
        this.controlEl.objectX.max = (this.canvas.getWidth() / 4).toString()
        this.controlEl.objectX.min = (-this.canvas.getWidth() / 4).toString()

        this.controlEl.scale.value = this.lineGroup?.getScale().toString() ?? "1"
        this.controlEl.scale.max = "4"
        this.controlEl.scale.min = "1"
    }

    private setupEvents(): void
    {
        // Ubah nilai skala ketika slider skala digeser
        this.controlEl.scale.addEventListener('input', () => {
            this.lineGroup?.setScale(parseInt(this.controlEl.scale.value))
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
        // Skip render jika line group masih kosong
        if (!this.lineGroup) {
            return
        }

        const posX = parseInt(this.controlEl.objectX.value)

        this.lineGroup.setX(posX)

        this.canvas.clearCanvas()
        this.lineGroup.setColor("blue")
        this.canvas.drawLineGroup(this.lineGroup)
    }
}