import { Canvas } from "./canvas"
import { LineGroup } from "./line-group"

export interface MirrorConstructorParameters {
    canvas: Canvas,
    mirrorObject?: LineGroup | null,

    controlEl: MirrorControlElements,
}

export interface MirrorControlElements {
    distance: HTMLInputElement
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
        const maxDistance = this.canvas.getWidth() / 2 - (this.lineGroup?.getWidth() ?? 0)

        // Atur range min & max dari input slider
        this.controlEl.distance.max = maxDistance.toString() 
        this.controlEl.distance.min = "0"

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

        // Jarak objek (line group) dari cermin, dengan asumsi cermin berada di tengah-tengah canvas.
        const distance = parseInt(this.controlEl.distance.value) - this.canvas.getWidth() / 2 

        // Pastikan koordinat Y terkecil dalam line group adalah 0, agar tidak bug
        this.lineGroup.setOffset(distance, -this.lineGroup.getHeight()) 

        this.canvas.clearCanvas()
        this.canvas.setPenColor("blue")
        this.canvas.drawLines(this.lineGroup.getLines(), this.lineGroup.getOffsetX(), this.lineGroup.getOffsetY())
    }
}