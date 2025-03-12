import { randomString } from "../utils/string"
import { Line } from "./line"

export interface CanvasConstructorParameters {
    canvasEl: HTMLCanvasElement
    gridSize?: number
}

export class Canvas {
    private element: HTMLCanvasElement
    private pen: CanvasRenderingContext2D

    private width: number
    private height: number

    private gridSize: number

    private onResizeCallbacks: { [key: string]: () => void }

    public constructor(params: CanvasConstructorParameters)
    {
        this.element = params.canvasEl
        this.width = window.innerWidth
        this.height = window.innerHeight 

        this.gridSize = params.gridSize ?? 20

        this.onResizeCallbacks = {}

        // Context (bahasa simpelnya: 'pen' / 'pulpen' / 'brush') digunakan untuk merender line, shape, text, dll pada canvas
        this.pen = this.element.getContext("2d")!

        this.fitCanvasToWindow()
        this.drawAxisLines()
        this.drawGridLines()

        this.setupEvents()
    }

    private setupEvents(): void {
        window.addEventListener('resize', () => {
            this.fitCanvasToWindow()
            this.drawAxisLines()
            this.drawGridLines()

            Object.values(this.onResizeCallbacks).map(callback => {
                callback()
            })
        })
    }

    private fitCanvasToWindow(): void {
        this.width = window.innerWidth
        this.height = window.innerHeight 

        this.element.width = this.width
        this.element.height = this.height
    }

    // === Utama ===
    public drawLine(line: Line, offsetX: number = 0, offsetY: number = 0, useCenterAnchor: boolean = true): void
    {
        // Karena color itu opsional pada object line, sebelum ganti warna pen harus dicek dulu ada nilainya atau tidak.
        if (line.color) {
            this.setPenColor(line.color)
        }

        // Secara default, anchor (patokan) saat merender garis berada pada tengah-tengah canvas
        const x1 = useCenterAnchor
            ? line.x1 + offsetX + this.getXCenter()
            : line.x1

        const y1 = useCenterAnchor
            ? line.y1 + offsetY + this.getYCenter()
            : line.y1 

        const x2 = useCenterAnchor
            ? line.x2 + offsetX + this.getXCenter()
            : line.x2

        const y2 = useCenterAnchor
            ? line.y2 + offsetY + this.getYCenter()
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

    public drawLines(lines: Line[], offsetX: number = 0, offsetY: number = 0, useCenterAnchor: boolean = true): void
    {
        lines.forEach(line => {
            this.drawLine(line, offsetX, offsetY, useCenterAnchor)
        })
    }

    public clearCanvas(): void
    {
        this.pen.clearRect(0, 0, this.width, this.height)
        this.drawAxisLines()
        this.drawGridLines()
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

    public getWidth(): number
    {
        return this.width
    }

    public getHeight(): number
    {
        return this.width
    }

    public onResize(callback: () => void): string
    {
        const id = randomString()
        this.onResizeCallbacks[id] = callback

        return id
    }

    public getOnResizeCallbacks(): { [key: string]: () => void }
    {
        return this.onResizeCallbacks
    }

    public clearOnResizeCallbacks(): void
    {
        this.onResizeCallbacks = {}
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
        this.drawLine(xAxisLine, 0, 0, false)
        this.drawLine(yAxisLine, 0, 0, false)
        this.resetPenColor()
    }

    private drawGridLines(): void
    {
        // Vertical line - left 
        for (let x = this.getXCenter(); x > 0; x -= this.gridSize) {
            this.pen.moveTo(x, 0)
            this.pen.lineTo(x, this.height)
        }

        // Vertical line - right 
        for (let x = this.getXCenter(); x <= this.width; x += this.gridSize) {
            this.pen.moveTo(x, 0)
            this.pen.lineTo(x, this.height)
        }

        // Horizontal line - bottom
        for (let y = this.getYCenter(); y > 0; y -= this.gridSize) {
            this.pen.moveTo(0, y)
            this.pen.lineTo(this.width, y)
        }

        // Horizontal line - bottom
        for (let y = this.getYCenter(); y <= this.height ; y += this.gridSize) {
            this.pen.moveTo(0, y)
            this.pen.lineTo(this.width, y)
        }

        this.setPenColor("#00000008")
        this.pen.stroke()
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