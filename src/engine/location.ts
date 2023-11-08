export class Location {
    private _x: number;
    get x(): number {
        return this._x;
    }

    private _y: number;
    get y(): number {
        return this._y;
    }

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public equals(a: Location, b: Location) {
        return a.x === b.x && a.y === b.y;
    }
}
