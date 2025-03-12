import { Line } from "./line"

export interface LineGroupOptions {
    x?: number
    y?: number
    scale?: number
    color?: string
}

export class LineGroup {
    private originalLines: Line[]
    private lines: Line[]

    private x: number
    private y: number
    private scale: number

    private color: string

    public constructor(lines: Line[], options?: LineGroupOptions)
    {
        this.x = options?.x ?? 0
        this.y = options?.y ?? 0
        this.scale = options?.scale ?? 1
        this.color = options?.color ?? "#000000"

        this.originalLines = lines
        this.lines = this.calculateLines(this.originalLines)
    }

    // === Parser ===
    // Parse Line dari array koordinat yang diberikan
    public static fromCoordinates(coordinates: number[][], options?: LineGroupOptions): LineGroup
    {
        if (!coordinates.every(coordinate => coordinate.length === 4)) {
            throw new Error("Data garis tidak valid!")
        }

        const lines = coordinates.map(coordinate => new Line({
            x1: coordinate[0],
            y1: coordinate[1],
            x2: coordinate[2],
            y2: coordinate[3],
        }))

        return new this(lines, options)
    }

    // === Helpers ===
    private calculateLines(lines: Line[]): Line[] {
        // Sumbu y di-flip biar nilai positif arahnya ke atas
        // Lihat: https://www.w3schools.com/graphics/canvas_coordinates.asp
        return lines.map(line => new Line({
            x1: line.x1 * this.scale  + this.x,
            y1: -line.y1 * this.scale - this.y,
            x2: line.x2 * this.scale + this.x,
            y2: -line.y2 * this.scale - this.y,
        })) 
    }

    public getWidth(): number
    {
        const xCoordinates = this.lines.flatMap(line => [line.x1, line.x2])

        const lowestXCoordinate = Math.min.apply(Math, xCoordinates)
        const highestXCoordinate = Math.max.apply(Math, xCoordinates)

        return Math.abs(highestXCoordinate - lowestXCoordinate)
    }

    public getHeight(): number
    {
        const yCoordinates = this.lines.flatMap(line => [line.y1, line.y2])

        const lowestYCoordinate = Math.min.apply(Math, yCoordinates)
        const highestYCoordinate = Math.max.apply(Math, yCoordinates)

        return Math.abs(highestYCoordinate - lowestYCoordinate)
    }

    public getCenterX(): number
    {
        const xCoordinates = this.lines.flatMap(line => [line.x1, line.x2])

        const lowestXCoordinate = Math.min.apply(Math, xCoordinates)
        const highestXCoordinate = Math.max.apply(Math, xCoordinates)

        const centerHeightX = Math.abs(highestXCoordinate - lowestXCoordinate) / 2

        return highestXCoordinate - centerHeightX
    }

    public getCenterY(): number
    {
        const yCoordinates = this.lines.flatMap(line => [line.y1, line.y2])

        const lowestYCoordinate = Math.min.apply(Math, yCoordinates)
        const highestYCoordinate = Math.max.apply(Math, yCoordinates)

        const centerHeightY = Math.abs(highestYCoordinate - lowestYCoordinate) / 2

        return highestYCoordinate - centerHeightY
    }

    public cloneObject(): LineGroup {
        return new LineGroup(
            this.lines.map(line => new Line({
                x1: line.x1,
                y1: line.y1,
                x2: line.x2,
                y2: line.y2,
            })),
            { x: this.x, y: this.y, scale: this.scale }
        );
    }

    // === Getter & Setter ===
    public getLines(): Line[]
    {
        return this.lines
    }

    public setLines(value: Line[])
    {
        this.lines = value
    }

    public setPosition(x: number, y: number): void
    {
        this.x = x
        this.y = y

        this.lines = this.calculateLines(this.originalLines)
    }

    public getX(): number
    {
        return this.x
    }

    public setX(value: number): void
    {
        this.x = value

        this.lines = this.calculateLines(this.originalLines)
    }

    public getY(): number
    {
        return this.y
    }

    public setY(value: number): void
    {
        this.y = value
        
        this.lines = this.calculateLines(this.originalLines)
    }

    public getScale(): number
    {
        return this.scale
    }

    public setScale(scale: number): void
    {
        this.scale = scale

        this.lines = this.calculateLines(this.originalLines)
    }

    public getColor(): string
    {
        return this.color
    }

    public setColor(color: string): void
    {
        this.color = color
    }
}