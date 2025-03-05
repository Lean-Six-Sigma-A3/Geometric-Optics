import { CanvasObject } from "./canvas-object"

export interface LineConstructorParameters {
    x1: number
    x2: number
    y1: number
    y2: number
    color?: string | null
}

export class Line extends CanvasObject {
    public x1: number
    public y1: number
    public x2: number
    public y2: number
    public color: string | null

    public constructor(params: LineConstructorParameters)
    {
        super()

        this.x1 = params.x1
        this.y1 = params.y1
        this.x2 = params.x2
        this.y2 = params.y2
        this.color = params.color ?? null
    }

    // === Parser ===
    // Parse Line dari array koordinat yang diberikan
    public static fromCoordinates(coordinates: number[][], xOffset: number = 0, yOffset: number = 0): Line[]
    {
        if (!coordinates.every(coordinate => coordinate.length === 4)) {
            throw new Error("Data garis tidak valid!")
        }

        return coordinates.map(coordinate => {
            const line = new Line({
                x1: coordinate[0],
                y1: coordinate[1],
                x2: coordinate[2],
                y2: coordinate[3],
            })

            line.setOffset(xOffset, yOffset)

            return line
        })
    }

    public static fromArray(lines: LineConstructorParameters[], xOffset: number = 0, yOffset: number = 0): Line[]
    {
        return lines.map(line => {
            const lineObject = new Line(line)

            lineObject.setOffset(xOffset, yOffset)

            return lineObject
        })
    }

    // === Helpers ===
    public getXDistance(): number
    {
        return this.x2 - this.x1
    }

    public getYDistance(): number
    {
        return this.x2 - this.x1
    }

    public getDistance(): number
    {
        return Math.sqrt(
            Math.pow(this.getXDistance(), 2) + Math.pow(this.getYDistance(), 2)
        )
    }
}