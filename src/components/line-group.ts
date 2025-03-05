import { Line } from "./line"

export class LineGroup {
    private lines: Line[]
    private offsetX: number
    private offsetY: number

    public constructor(lines: Line[], offsetX: number = 0, offsetY: number = 0)
    {
        this.lines = lines
        this.offsetX = offsetX
        this.offsetY = offsetY
    }

    // === Parser ===
    // Parse Line dari array koordinat yang diberikan
    public static fromCoordinates(coordinates: number[][], offsetX: number = 0, offsetY: number = 0): LineGroup
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

        return new this(lines, offsetX, offsetY)
    }

    // === Helpers ===
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

    // === Getter & Setter ===
    public getLines(): Line[]
    {
        return this.lines
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
}