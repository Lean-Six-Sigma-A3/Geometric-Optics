import { randomString } from "../utils/string"
import { Line } from "./line"
import { LineGroup } from "./line-group"

export interface CanvasConstructorParameters {
    canvasEl: HTMLCanvasElement
    gridSize?: number
}

export interface CanvasDrawRayLineParameters {
    x1: number
    y1: number 
    x2: number 
    y2: number
    xMax?: number
    yMax?: number
    xMin?: number
    yMin?: number
    color?: string
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
    public drawLine(line: Line, offsetX: number = 0, offsetY: number = 0): void
    {
        // Karena color itu opsional pada object line, sebelum ganti warna pen harus dicek dulu ada nilainya atau tidak.
        if (line.color) {
            this.setPenColor(line.color)
        }

        const clamp = (value: number) => Math.max(-this.width / 2, Math.min(this.width / 2, value))

        // Secara default, anchor (patokan) saat merender garis berada pada tengah-tengah canvas
        const x1 = clamp(line.x1 + offsetX)
        const y1 = clamp(line.y1 + offsetY)
        const x2 = clamp(line.x2 + offsetX)
        const y2 = clamp(line.y2 + offsetY)

        const dx = x2 - x1
        const dy = y2 - y1
        const steps = Math.max(Math.abs(dx), Math.abs(dy))
        const xIncrement = dx / steps
        const yIncrement = dy / steps

        let x = x1
        let y = y1

        for (let i = 0; i <= steps; i++) {
            this.pen.fillRect(
                Math.round(x) + this.getXCenter(),
                Math.round(y) + this.getYCenter(),
                1,
                1,
            )

            x += xIncrement
            y += yIncrement
        }
    }

    public drawLineGroup(lineGroup: LineGroup, withCenterIndicator: boolean = false): void
    {
        this.setPenColor(lineGroup.getColor())

        lineGroup.getLines().forEach(line => {
            this.drawLine(line)
        })

        if (withCenterIndicator) {
            this.pen.beginPath()
            this.pen.arc(Math.round(lineGroup.getCenterX()) + this.getXCenter(), Math.round(lineGroup.getCenterY()) + this.getYCenter(), 4, 0, 2 * Math.PI)
            this.pen.closePath()
            this.pen.fill()
        }

        this.resetPenColor()
    }

    public drawCircle(x: number, y: number, radius: number): void
    {
        this.pen.beginPath()
        this.pen.arc(x + this.getXCenter(), y + this.getYCenter(), radius, 0, 2 * Math.PI)
        this.pen.closePath()
        this.pen.fill()
    }

    public drawText(text: string, x: number, y: number, font: string = '12px Arial', color: string = 'black', align: CanvasTextAlign = 'center'): void
    {
        this.setPenColor(color)
        this.pen.font = font;
        this.pen.textAlign = align;

        this.pen.fillText(text, x + this.getXCenter(), y + this.getYCenter());

        this.resetPenColor()
    }

    public drawRayLine(params: CanvasDrawRayLineParameters): void
    {
        const {
            x1,
            y1,
            x2,
            y2,
            xMax,
            yMax,
            xMin,
            yMin,
            color,
        } = params

        if (color) {
            this.setPenColor(color)
        }

        const dx = x2 - x1
        const dy = y2 - y1

        const xIncrement = dx / Math.sqrt(dx * dx + dy * dy)
        const yIncrement = dy / Math.sqrt(dx * dx + dy * dy)

        let x = x1
        let y = y1
        
        for (let i = 0; i < this.width; i++) {
            const exceedsCustomConstraint = (
                (xMax !== undefined && x > xMax) ||
                (yMax !== undefined && y > yMax) ||
                (xMin !== undefined && x < xMin) ||
                (yMin !== undefined && y < yMin)
            )
            
            if (!exceedsCustomConstraint || (exceedsCustomConstraint && Math.abs(Math.round(x)) % 2)) {
                this.pen.fillRect(
                    Math.round(x) + this.getXCenter(),
                    -Math.round(y) + this.getYCenter(),
                    1,
                    1,
                )
            }

            x += xIncrement
            y += yIncrement

            const exceedsBoundary = (
                x < -this.width / 2 ||
                x > this.width / 2 ||
                y < -this.height / 2 ||
                y > this.height / 2
            )

            if (exceedsBoundary) {
                break;
            }
        }

        if (color) {
            this.resetPenColor()
        }
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
        return this.height
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
        this.pen.beginPath()
        this.pen.moveTo(0, this.getYCenter())
        this.pen.lineTo(this.width, this.getYCenter())
        this.pen.moveTo(this.getXCenter(), 0)
        this.pen.lineTo(this.getXCenter(), this.height)
        this.pen.closePath()

        this.setPenColor("lightgrey")
        this.pen.stroke()

        this.resetPenColor()
        //Add axis labels
        this.pen.font = "14px Arial";
        this.pen.textAlign = "center";
        this.pen.fillText("X", this.width - 20, this.getYCenter() - 10);
        this.pen.fillText("Y", this.getXCenter() + 10, 20);


        //Add center point label
        this.pen.fillText("(0,0)", this.getXCenter() + 20, this.getYCenter() + 20);
        
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

        this.setPenColor("#00000018")
        this.pen.stroke()
        this.resetPenColor()
    }

    public setPenColor(color: string): void
    {
        this.pen.strokeStyle = color
        this.pen.fillStyle = color
    }

    public resetPenColor(): void
    {
        this.pen.strokeStyle = "#000000"
        this.pen.fillStyle = "#000000"
    }
}