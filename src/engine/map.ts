import { Cavern } from "./cavern";
import { GameDifficultFactory, GameDifficulty, GameDifficultyValues } from "./gameDifficulty";
import { Location } from "./location";
import { Direction } from "./direction";
import { Random } from "./random";

export class Map {
    private _random: Random;
    private _map: Cavern[];
    public MapWidth: number = 8;
    public MapHeight: number = 6;

    public get seed(): string {
        return this._random.seed;
    }

    private _difficultyValues: GameDifficultyValues;
    public get gameDifficultyValues(): GameDifficultyValues {
        return this._difficultyValues;
    }

    public constructor(difficulty: GameDifficulty, rand: Random) {
        this._random = rand;
        this._difficultyValues = new GameDifficultFactory().getValues(difficulty);
        this._map = [];

        while (!this.createMap());
    }

    public toMapIndex(x: number, y: number) {
        return y * this.MapWidth + x;
    }

    private createMap(): boolean {
        this._map.length = 0;

        for (let y = 0; y < this.MapHeight; y++) {
            for (let x = 0; x < this.MapWidth; x++) {
                this._map.push(new Cavern(new Location(x, y)));
            }
        }

        for (let i = 0; i < this.MapWidth * this.MapHeight; i++) {
            let maxExits = 2;
            let cavern = this._map[i];

            if (this.getAdjacentCell(cavern, Direction.North).south !== undefined) maxExits++;
            if (this.getAdjacentCell(cavern, Direction.West).east !== undefined) maxExits++;

            let exits = this._random.nextMax(maxExits) + 1;

            while (cavern.exitCount() < exits) {
                let exit = this._random.nextMax(4) as Direction;

                while (cavern.getAdjacent(exit) !== undefined && this._difficultyValues.difficulty < GameDifficulty.Hard) {
                    exit++;

                    if (exit > 3)
                        exit = Direction.North;
                }

                cavern.setAdjacent(exit, this.getAdjacentCell(cavern, exit));
            }
        }

        // Set Tunnels
        let possibleTunnels: Location[] = [];

        for (let y = 0; y < this.MapHeight; y++) {
            for (let x = 0; x < this.MapWidth; x++) {
                let index = this.toMapIndex(x, y);
                let exits = this._map[index].exitCount();

                if (exits === 2 || exits === 4)
                    possibleTunnels.push(this._map[index].location);
            }
        }

        let tunnelMax = this._difficultyValues.tunnelMax;

        for (; tunnelMax > 0 && possibleTunnels.length > 0; tunnelMax--) {
            let newTunnelLoc = possibleTunnels[this._random.nextMax(possibleTunnels.length)];
            possibleTunnels.splice(possibleTunnels.indexOf(newTunnelLoc), 1);
            let cavern = this._map[this.toMapIndex(newTunnelLoc.x, newTunnelLoc.y)];
            cavern.isCave = false;
        }

        // Set Pits
        let pits: Cavern[] = [];

        for (let i = 0; i < this._difficultyValues.numPits;) {
            let index = this.toMapIndex(
                this._random.nextMax(this.MapWidth),
                this._random.nextMax(this.MapHeight));

            let cavern = this._map[index];

            if (!cavern.isPit && cavern.isCave) {
                cavern.isPit = true;
                pits.push(this._map[index]);
                i++;
            }
        }

        // Set Pit Warnings
        for (let cavern of pits) {
            for (let i = 0; i < 4; i++) {
                let adjacent = this.getAdjacentCavern(cavern, i);

                if (adjacent !== undefined && !adjacent.isPit) {
                    adjacent.isAdjacentPit = true;
                }
            }
        }

        if (!this.ensureMapIntegrity()) {
            return false;
        }

        // Set bats
        for (let i = 0; i < this._difficultyValues.batCount; i++) {
            this.setRandomBatLocation();
        }

        // Set Wumpus
        let wumpusCavern: Cavern;

        while (true) {
            let index = this.toMapIndex(this._random.nextMax(this.MapWidth),
                this._random.nextMax(this.MapHeight));

            if (this._difficultyValues.difficulty !== GameDifficulty.Easy || (this._difficultyValues.difficulty === GameDifficulty.Easy && this._map[index].isCave)) {
                wumpusCavern = this._map[index];

                if (wumpusCavern.isCave) {
                    wumpusCavern.hasWumpus = true;
                    break;
                }
            }
        }

        this.setBloodCaverns(wumpusCavern, 2);

        wumpusCavern.hasBlood = false;

        return true;
    }

    public setRandomBatLocation(): Cavern {
        let cavern: Cavern;

        while (true) {
            let index = this.toMapIndex(
                this._random.nextMax(this.MapWidth),
                this._random.nextMax(this.MapHeight));

            cavern = this._map[index];

            if (!cavern.hasBat && cavern.isCave) {
                this._map[index].hasBat = true;
                break;
            }
        }

        return cavern;
    }

    private setBloodCaverns(cavern: Cavern, length: number): void {
        cavern.hasBlood = true;

        if (length > 0) {
            for (let i = 0; i < 4; i++) {
                let nextCavern = this.getAdjacentCavern(cavern, i);

                if (nextCavern !== undefined)
                    this.setBloodCaverns(nextCavern, length - 1);
            }
        }
    }

    public getCavern(x: number, y: number): Cavern {
        return this._map[this.toMapIndex(x, y)];
    }

    private getAdjacentCell(cavern: Cavern, direction: Direction): Cavern {
        let x = cavern.location.x;
        let y = cavern.location.y;

        switch (direction) {
            case Direction.North:
                y = (y === 0) ? this.MapHeight - 1 : y - 1;
                break;
            case Direction.East:
                x = (x === this.MapWidth - 1) ? 0 : x + 1;
                break;
            case Direction.South:
                y = (y === this.MapHeight - 1) ? 0 : y + 1;
                break;
            case Direction.West:
                x = (x === 0) ? this.MapWidth - 1 : x - 1;
                break;
        }

        return this._map[this.toMapIndex(x, y)];
    }

    private getAdjacentCavern(cavern: Cavern, direction: Direction): Cavern | undefined {
        let result: Cavern | undefined;
        let adjacent = cavern.getAdjacent(direction);

        if (adjacent !== undefined) {
            if (adjacent.isCave) {
                result = adjacent;
            }
            else {
                let tunnel = adjacent;
                let entrance = ((direction + 2) % 4) as Direction;

                if (tunnel.exitCount() === 4) {
                    switch (entrance) {
                        case Direction.North: result = this.getAdjacentCavern(tunnel, Direction.West); break;
                        case Direction.East: result = this.getAdjacentCavern(tunnel, Direction.South); break;
                        case Direction.South: result = this.getAdjacentCavern(tunnel, Direction.East); break;
                        case Direction.West: result = this.getAdjacentCavern(tunnel, Direction.North); break;
                    }
                }
                else {
                    for (let i = 0; i < 4; i++) {
                        if (i === entrance) {
                            continue;
                        }

                        if (tunnel.getAdjacent(i) !== undefined) {
                            result = this.getAdjacentCavern(tunnel, i);
                        }
                    }
                }
            }
        }

        return result;
    }

    private ensureMapIntegrity(): boolean {
        // Use the bat property to check for dead zones
        let lastDirection: Direction[] = [];
        this.caveTrace(lastDirection, this._map[0]);

        for (let cavern of this._map) {
            if (!cavern.hasBat) {
                this.resetBats();
                return false;
            }
        }

        this.resetBats();
        return true;
    }

    private caveTrace(lastDirection: Direction[], cavern: Cavern): void {
        if (cavern.hasBat)
            return;

        cavern.hasBat = true;

        if (!cavern.isCave && cavern.exitCount() === 4) {
            // tunnel cells with 2 tunnels require special handling

            if (lastDirection.length === 0) {
                lastDirection.push(Direction.East);
                this.caveTrace(lastDirection, cavern.west!);
                lastDirection.pop();

                lastDirection.push(Direction.North);
                this.caveTrace(lastDirection, cavern.south!);
                lastDirection.pop();

                lastDirection.push(Direction.West);
                this.caveTrace(lastDirection, cavern.east!);
                lastDirection.pop();

                lastDirection.push(Direction.South);
                this.caveTrace(lastDirection, cavern.north!);
            }
            else {
                switch (lastDirection[lastDirection.length - 1]) {
                    case Direction.North:
                        lastDirection.push(Direction.East);
                        this.caveTrace(lastDirection, cavern.west!);
                        break;
                    case Direction.East:
                        lastDirection.push(Direction.North);
                        this.caveTrace(lastDirection, cavern.south!);
                        break;
                    case Direction.South:
                        lastDirection.push(Direction.West);
                        this.caveTrace(lastDirection, cavern.east!);
                        break;
                    case Direction.West:
                        lastDirection.push(Direction.South);
                        this.caveTrace(lastDirection, cavern.north!);
                        break;
                }
            }
        }
        else {
            if (cavern.north !== undefined) {
                lastDirection.push(Direction.South);
                this.caveTrace(lastDirection, cavern.north);
            }

            if (cavern.east !== undefined) {
                lastDirection.push(Direction.West);
                this.caveTrace(lastDirection, cavern.east);
            }

            if (cavern.south !== undefined) {
                lastDirection.push(Direction.North);
                this.caveTrace(lastDirection, cavern.south);
            }

            if (cavern.west !== undefined) {
                lastDirection.push(Direction.East);
                this.caveTrace(lastDirection, cavern.west);
            }
        }

        lastDirection.pop();
    }

    private resetBats(): void {
        for (let cavern of this._map) {
            cavern.hasBat = false;
        }
    }

    // for debugging

    // public getWumpusCavern(): Cavern {
    //     return this._map.find(x => x.hasWumpus)!;
    // }

    // public getPitCavern(): Cavern {
    //     return this._map.find(x => x.isPit)!;
    // }
}
