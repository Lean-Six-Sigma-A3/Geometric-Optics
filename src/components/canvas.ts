import { Line } from "./line"

export interface CanvasConstructorParameters {
    canvasEl: HTMLCanvasElement
    width: number
    height: number
}

export class Canvas {
    private element: HTMLCanvasElement
    private width: number
    private height: number
    private pen: CanvasRenderingContext2D

    public constructor(params: CanvasConstructorParameters)
    {
        this.element = params.canvasEl
        this.width = params.width
        this.height = params.height

        this.element.width = this.width
        this.element.height = this.height

        // Context (bahasa simpelnya: 'pen' / 'pulpen' / 'brush') digunakan untuk merender line, shape, text, dll pada canvas
        this.pen = this.element.getContext("2d")!

        this.drawAxisLines()
    }

    // === Utama ===
    public drawLine(line: Line, useCenterAnchor: boolean = true): void
    {
        // Karena color itu opsional pada object line, sebelum ganti warna pen harus dicek dulu ada nilainya atau tidak.
        if (line.color) {
            this.setPenColor(line.color)
        }

        // Secara default, anchor (patokan) saat merender garis berada pada tengah-tengah canvas
        const x1 = useCenterAnchor
            ? line.x1 + line.getXPadding() + this.getXCenter()
            : line.x1

        const y1 = useCenterAnchor
            ? line.y1 + line.getYPadding() + this.getYCenter()
            : line.y1 

        const x2 = useCenterAnchor
            ? line.x2 + line.getXPadding() + this.getXCenter()
            : line.x2

        const y2 = useCenterAnchor
            ? line.y2 + line.getYPadding() + this.getYCenter()
            : line.y2
    
        // Mulai path untuk garis
        this.pen.beginPath()
        // Geser pen ke (x1, y1)
        this.pen.moveTo(x1, y1)
        // Buat tujuan garis ke (x2, y2) dari posisi sebelumnya
        this.pen.lineTo(x2, y2)
        // Gambar (render) garisnya
        this.pen.stroke()
        // Tutup path (biar gak tercampur dengan garis lainnya)
        this.pen.closePath()
    }

    public drawLines(lines: Line[]): void
    {
        lines.forEach(line => {
            this.drawLine(line)
        })
    }

    // === Getter / Setter ===
    public getElement(): HTMLCanvasElement
    {
        return this.element
    }

    public getPen(): CanvasRenderingContext2D
    {
        return this.pen
    }

    // === Helpers ===
    public getXCenter(): number
    {
        return Math.round(this.width / 2)
    }

    public getYCenter(): number
    {
        return Math.round(this.height / 2)
    }

    // Untuk menggambar garis sumbu
    private drawAxisLines(): void
    {
        const xAxisLine = new Line({
            x1: 0,
            y1: this.getYCenter(),
            x2: this.width,
            y2: this.getYCenter(),
        })

        const yAxisLine = new Line({
            x1: this.getXCenter(),
            y1: 0,
            x2: this.getXCenter(),
            y2: this.height,
        })

        this.setPenColor("lightgrey")
        this.drawLine(xAxisLine, false)
        this.drawLine(yAxisLine, false)
        this.resetPenColor()
    }

    public setPenColor(color: string): void
    {
        this.pen.strokeStyle = color
    }

    private resetPenColor(): void
    {
        this.pen.strokeStyle = "#000000"
    }
}