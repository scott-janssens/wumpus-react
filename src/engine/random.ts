import seedrandom, { PRNG } from "seedrandom";

export class Random {
    private _random: PRNG;

    private _seed: string;
    public get seed(): string {
        return this._seed;
    }
    public set seed(seed: string) {
        this._seed = seed;
        this._random = seedrandom(seed);
    }

    public constructor(seed: string | undefined = undefined) {
        this._seed = seed ?? String(seedrandom().int32());
        this._random = seedrandom(seed);
    }

    public next(): number {
        return this._random.int32();
    }

    public nextMax(max: number) {
        return Math.floor(this._random.double() * max);
    }

    public nextRange(min: number, max: number) {
        return Math.floor(this._random.double() * (max - min)) + min;
    }

    public nextDouble() {
        return this._random.double();
    }
}
