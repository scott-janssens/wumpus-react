import { Map } from "./map";
import { Location } from "./location";
import { EventDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import { GameDifficulty } from "./gameDifficulty";
import { Random } from "./random";
import { Direction } from "./direction";

export enum GameState {
    Idle = 0,
    Running,
    Won,
    Eaten,
    Pit,
    Missed
}

export class Engine {
    private _lastDirection: Direction;

    private _random: Random = new Random();
    public get random(): Random {
        return this._random;
    }

    private _onGameStateChanged = new SimpleEventDispatcher<GameState>();
    public get onGameStateChanged() {
        return this._onGameStateChanged.asEvent();
    }

    private _map: Map;
    public get map(): Map {
        return this._map;
    }

    private _playerLocation: Location = new Location(0, 0);
    public get playerLocation(): Location {
        return this._playerLocation;
    }

    private _gameState: GameState = GameState.Idle;
    public get gameState(): GameState {
        return this._gameState;
    }
    private set gameState(value: GameState) {
        if (this._gameState !== value) {
            this._gameState = value;
            this._onGameStateChanged.dispatch(value);
        }
    }

    private _onBatMoved = new EventDispatcher<Engine, BatMovedArgs>();
    public get onBatMoved() {
        return this._onBatMoved.asEvent();
    }

    public startNewGame(difficulty: GameDifficulty, seed: string | undefined = undefined): void {
        this._random = new Random(seed);
        this._map = new Map(difficulty, this._random!);

        let loc: Location;

        while (true) {
            loc = this.getRandomLocation();
            let cavern = this._map.getCavern(loc.x, loc.y);

            if (cavern.isCave && !cavern.isPit && !cavern.hasWumpus)
                break;
        }

        this.setPlayerLocation(loc, Direction.West);
        this._map.getCavern(loc.x, loc.y).reveal();
        this.gameState = GameState.Running;
    }

    private showAllMap(): void {
        for (let x = 0; x < this._map.MapWidth; x++) {
            for (let y = 0; y < this._map.MapHeight; y++) {
                this._map.getCavern(x, y).reveal();
            }
        }
    }

    private getRandomLocation(): Location {
        return new Location(this._random.nextMax(this._map.MapWidth), this._random.nextMax(this._map.MapHeight));
    }

    public movePlayer(direction: Direction): void {
        if (this.gameState !== GameState.Running)
            return;

        let cavern = this._map.getCavern(this._playerLocation.x, this._playerLocation.y);
        let newLocation: Location | undefined;

        if (!cavern.isCave && cavern.exitCount() === 4) {
            // tunnel cells with 2 tunnels require special handling

            switch (direction) {
                case Direction.North:
                    if (this._lastDirection !== Direction.North && this._lastDirection !== Direction.West) {
                        newLocation = new Location(this._playerLocation.x, this._playerLocation.y === 0 ? this._map.MapHeight - 1 : this._playerLocation.y - 1);
                    }
                    break;
                case Direction.East:
                    if (this._lastDirection !== Direction.East && this._lastDirection !== Direction.South) {
                        newLocation = new Location(this._playerLocation.x === this._map.MapWidth - 1 ? 0 : this._playerLocation.x + 1, this._playerLocation.y);
                    }
                    break;
                case Direction.South:
                    if (this._lastDirection !== Direction.South && this._lastDirection !== Direction.East) {
                        newLocation = new Location(this._playerLocation.x, this._playerLocation.y === this._map.MapHeight - 1 ? 0 : this._playerLocation.y + 1);
                    }
                    break;
                case Direction.West:
                    if (this._lastDirection !== Direction.West && this._lastDirection !== Direction.North) {
                        newLocation = new Location(this._playerLocation.x === 0 ? this._map.MapWidth - 1 : this._playerLocation.x - 1, this._playerLocation.y);
                    }
                    break;
            }
        }
        else {

            switch (direction) {
                case Direction.North:
                    if (cavern.north !== undefined) {
                        newLocation = new Location(this._playerLocation.x, this._playerLocation.y === 0 ? this._map.MapHeight - 1 : this._playerLocation.y - 1);
                    }
                    break;
                case Direction.East:
                    if (cavern.east !== undefined) {
                        newLocation = new Location(this._playerLocation.x === this._map.MapWidth - 1 ? 0 : this._playerLocation.x + 1, this._playerLocation.y);
                    }
                    break;
                case Direction.South:
                    if (cavern.south !== undefined) {
                        newLocation = new Location(this._playerLocation.x, this._playerLocation.y === this._map.MapHeight - 1 ? 0 : this._playerLocation.y + 1);
                    }
                    break;
                case Direction.West:
                    if (cavern.west !== undefined) {
                        newLocation = new Location(this._playerLocation.x === 0 ? this._map.MapWidth - 1 : this._playerLocation.x - 1, this._playerLocation.y);
                    }
                    break;
            }
        }

        this._lastDirection = direction;

        if (newLocation !== undefined) {
            this.setPlayerLocation(newLocation, direction);
        }
        else {
            this.map.getCavern(this._playerLocation.x, this._playerLocation.y).playerDirection = direction;
        }
    }

    private setPlayerLocation(location: Location, direction: Direction): void {
        let oldCavern = this._map.getCavern(this._playerLocation.x, this._playerLocation.y);
        oldCavern.playerDirection = undefined;

        this._playerLocation = location;
        let newCavern = this._map.getCavern(this._playerLocation.x, this._playerLocation.y);
        newCavern.playerDirection = direction;
        newCavern.reveal();

        if (newCavern.hasBat && (newCavern.hasWumpus || newCavern.isPit || this._map.gameDifficultyValues.batCarryPct > this._random.nextMax(100))) {
            let startLocation = newCavern.location;
            let newPlayerLocation = this.getRandomLocation();
            let batLocation = this.getRandomLocation();

            newCavern.hasBat = false;

            const droppedCavern = this._map.getCavern(newPlayerLocation.x, newPlayerLocation.y);

            this._map.setRandomBatLocation();
            this._onBatMoved.dispatch(this, new BatMovedArgs(startLocation, newPlayerLocation, batLocation, droppedCavern.hasWumpus || droppedCavern.isPit));
            this.setPlayerLocation(newPlayerLocation, direction);
        }
        else if (newCavern.hasWumpus) {
            this.endGame(GameState.Eaten);
        }
        else if (newCavern.isPit) {
            this.endGame(GameState.Pit);
        }
    }

    public fireArrow(direction: Direction): void {
        let cavern = this._map.getCavern(this._playerLocation.x, this._playerLocation.y);

        switch (direction) {
            case Direction.North:
                if (cavern.north !== undefined && cavern.north.hasWumpus) {
                    this.endGame(GameState.Won);
                }
                break;
            case Direction.East:
                if (cavern.east !== undefined && cavern.east.hasWumpus) {
                    this.endGame(GameState.Won);
                }
                break;
            case Direction.South:
                if (cavern.south !== undefined && cavern.south.hasWumpus) {
                    this.endGame(GameState.Won);
                }
                break;
            case Direction.West:
                if (cavern.west !== undefined && cavern.west.hasWumpus) {
                    this.endGame(GameState.Won);
                }
                break;
        }

        if (this.gameState !== GameState.Won) {
            this.endGame(GameState.Missed);
        }
    }

    public endGame(result: GameState): void {
        this.gameState = result;

        this.showAllMap();
    }
}

export class BatMovedArgs {
    private _startLocation: Location
    public get startLocation(): Location {
        return this._startLocation;
    }

    private _playerLocation: Location
    public get playerLocation(): Location {
        return this._playerLocation;
    }

    private _batLocation: Location
    public get batLocation(): Location {
        return this._batLocation;
    }

    private _gameStateChanged: boolean
    public get gameStateChanged(): boolean {
        return this._gameStateChanged;
    }

    public constructor(start: Location, player: Location, end: Location, gameStateChanged: boolean) {
        this._startLocation = start;
        this._playerLocation = player;
        this._batLocation = end;
        this._gameStateChanged = gameStateChanged;
    }
}
