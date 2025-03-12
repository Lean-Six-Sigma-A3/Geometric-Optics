import { Line } from "./line"

export interface LineGroupOptions {
    offsetX?: number
    offsetY?: number
    scale?: number
}

export class LineGroup {
    private lines: Line[]
    private offsetX: number
    private offsetY: number
    private scale: number

    public constructor(lines: Line[], options?: LineGroupOptions)
    {
        this.lines = lines
        this.offsetX = options?.offsetX ?? 0
        this.offsetY = options?.offsetY ?? 0
        this.scale = options?.scale ?? 1
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
    public getWidth(): number
    {
        const xCoordinates = this.lines.flatMap(line => [line.x1, line.x2])

        const lowestXCoordinate = Math.min.apply(Math, xCoordinates)
        const highestXCoordinate = Math.max.apply(Math, xCoordinates)

        return Math.abs(highestXCoordinate - lowestXCoordinate) * this.scale
    }

    public getHeight(): number
    {
        const yCoordinates = this.lines.flatMap(line => [line.y1, line.y2])

        const lowestYCoordinate = Math.min.apply(Math, yCoordinates)
        const highestYCoordinate = Math.max.apply(Math, yCoordinates)

        return Math.abs(highestYCoordinate - lowestYCoordinate) * this.scale
    }

    public cloneObject(): LineGroup {
        return new LineGroup(
            this.lines.map(line => new Line({
                x1: line.x1,
                y1: line.y1,
                x2: line.x2,
                y2: line.y2,
            })),
            { offsetX: this.offsetX, offsetY: this.offsetY, scale: this.scale }
        );
    }

    // === Getter & Setter ===
    public getLines(): Line[]
    {
        return this.lines.map(line => new Line({
            x1: line.x1 * this.scale,
            y1: line.y1 * this.scale,
            x2: line.x2 * this.scale,
            y2: line.y2 * this.scale,
        })) 
    }

    public setLines(lines: Line[]): void
    {
        this.lines = lines
    }

    public setOffset(x: number, y: number): void
    {
        this.offsetX = x
        this.offsetY = y
    }

    public getOffsetX(): number
    {
        return this.offsetX
    }

    public setOffsetX(value: number): void
    {
        this.offsetX = value
    }

    public getOffsetY(): number
    {
        return this.offsetY
    }

    public setOffsetY(value: number): void
    {
        this.offsetY = value
    }

    public getScale(): number
    {
        return this.scale
    }

    public setScale(scale: number): void
    {
        this.scale = scale
    }
}