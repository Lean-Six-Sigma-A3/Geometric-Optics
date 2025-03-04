// Cuma parent class untuk Line, biar bisa nambah padding aja sih
// Rencananya, padding dipake biar nanti bisa digeser-geser Line-nya 
export class CanvasObject {
    private _xPadding: number = 0
    private _yPadding: number = 0

    public setPadding(x: number, y: number): void
    {
        this._xPadding = x
        this._yPadding = y
    }

    public getXPadding(): number
    {
        return this._xPadding
    }

    public setXPadding(value: number): void
    {
        this._xPadding = value
    }

    public getYPadding(): number
    {
        return this._yPadding
    }

    public setYPadding(value: number): void
    {
        this._yPadding = value
    }
}