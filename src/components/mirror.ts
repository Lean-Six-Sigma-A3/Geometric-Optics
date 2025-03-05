import { Canvas } from "./canvas"
import { LineGroup } from "./line-group"

export interface MirrorConstructorParameters {
    canvas: Canvas,
    mirrorObject?: LineGroup | null,

    controlEl: MirrorControlElements,
}

export interface MirrorControlElements {
    distance: HTMLInputElement
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

    private setupEvents(): void
    {
        // Render ulang canvas setiap slider digeser
        this.controlEl.distance.addEventListener('input', () => {
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
        const distance = parseInt(this.controlEl.distance.value) - this.canvas.width / 2 

        // Pastikan koordinat Y terkecil dalam line group adalah 0, agar tidak bug
        this.lineGroup.setOffset(distance, -this.lineGroup.getHeight()) 

        this.canvas.clearCanvas()
        this.canvas.setPenColor("#040404")
        this.canvas.drawLines(this.lineGroup.getLines(), this.lineGroup.getOffsetX(), this.lineGroup.getOffsetY())
    }

    private prepareControlElements(): void
    {
        const maxDistance = this.canvas.width / 2 - (this.lineGroup?.getWidth() ?? 0)

        // Atur range min & max dari input slider
        this.controlEl.distance.max = maxDistance.toString() 
        this.controlEl.distance.min = "0"
    }
}