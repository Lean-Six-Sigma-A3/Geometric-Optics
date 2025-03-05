// Cuma parent class untuk Line, biar bisa nambah offset aja sih
// Rencananya, offset dipake biar nanti bisa digeser-geser Line-nya 
export class CanvasObject {
    private _xOffset: number = 0
    private _yOffset: number = 0

    public setOffset(x: number, y: number): void
    {
        this._xOffset = x
        this._yOffset = y
    }

    public getXOffset(): number
    {
        return this._xOffset
    }

    public setXOffset(value: number): void
    {
        this._xOffset = value
    }

    public getYOffset(): number
    {
        return this._yOffset
    }

    public setYOffset(value: number): void
    {
        this._yOffset = value
    }
}