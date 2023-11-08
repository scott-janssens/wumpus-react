export default class Point {
    private _x: number;
    get x(): number {
        return this._x;
    }

    private _y: number;
    get y(): number {
        return this._y;
    }

    public constructor(x: number, y: number, scaler: number = 1) {
        this._x = x * scaler;
        this._y = y * scaler;
    }

    public toString() {
        return `${this._x},${this._y}`;
    }
}
