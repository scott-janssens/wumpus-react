import { Location } from "./location";
import { Direction } from "./direction";
import { SignalDispatcher } from "strongly-typed-events";

export class Cavern {
    public north: Cavern | undefined;
    public east: Cavern | undefined;
    public south: Cavern | undefined;
    public west: Cavern | undefined;

    public isCave = true;
    public isPit: boolean = false;
    public isAdjacentPit: boolean = false;
    public hasBlood: boolean = false;
    public hasWumpus: boolean = false;

    private _onUpdated = new SignalDispatcher();
    public get onUpdated() {
        return this._onUpdated.asEvent();
    }

    private _location: Location;
    public get location() {
        return this._location;
    }

    private _hasBat: boolean = false;
    public get hasBat() {
        return this._hasBat;
    }
    public set hasBat(hasBat: boolean) {
        if (this._hasBat !== hasBat) {
            this._hasBat = hasBat;
            this._onUpdated.dispatch();
        }
    }

    private _playerDirection: Direction | undefined;
    public get playerDirection() {
        return this._playerDirection;
    }

    public set playerDirection(playerDirection: Direction | undefined) {
        if (this._playerDirection !== playerDirection) {
            this._playerDirection = playerDirection;
            this._onUpdated.dispatch();
        }
    }

    private _isRevealed: boolean = false;
    public get isRevealed(): boolean {
        return this._isRevealed;
    }

    public reveal(): void {
        if (!this._isRevealed) {
            this._isRevealed = true;
            this._onUpdated.dispatch();
        }
    }

    public constructor(location: Location) {
        this._location = location;
    }

    public getAdjacent(direction: Direction): Cavern | undefined {
        switch (direction) {
            case Direction.North:
                return this.north;
            case Direction.East:
                return this.east;
            case Direction.South:
                return this.south;
            case Direction.West:
                return this.west;
        }
    }

    public setAdjacent(direction: Direction, cavern: Cavern): void {
        switch (direction) {
            case Direction.North:
                this.north = cavern;
                cavern.south = this;
                break;
            case Direction.East:
                this.east = cavern;
                cavern.west = this;
                break;
            case Direction.South:
                this.south = cavern;
                cavern.north = this;
                break;
            case Direction.West:
                this.west = cavern;
                cavern.east = this;
                break;
        }
    }

    public exitCount(): number {
        let result = 0;

        if (this.north != null)
            result++;
        if (this.east != null)
            result++;
        if (this.south != null)
            result++;
        if (this.west != null)
            result++;

        return result;
    }

    public getExitCode(): number {
        let exits = 0;

        if (this.north != null) exits = 1;
        if (this.east != null) exits += 2;
        if (this.south != null) exits += 4;
        if (this.west != null) exits += 8;

        return exits;
    }
}
