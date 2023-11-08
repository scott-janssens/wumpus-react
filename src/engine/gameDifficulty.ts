export enum GameDifficulty {
    Easy = 0,
    Normal,
    Hard
}

export interface GameDifficultyValues {
    difficulty: GameDifficulty,
    batCount: number;
    batCarryPct: number;
    tunnelMax: number;
    numPits: number;
}

export class GameDifficultFactory {
    public getValues(difficulty: GameDifficulty): GameDifficultyValues {
        switch (difficulty) {
            case GameDifficulty.Easy:
                return {
                    difficulty: difficulty,
                    batCount: 1,
                    batCarryPct: 50,
                    tunnelMax: 5,
                    numPits: 1
                } as GameDifficultyValues;
            case GameDifficulty.Normal:
                return {
                    difficulty: difficulty,
                    batCount: 2,
                    batCarryPct: 66,
                    tunnelMax: 15,
                    numPits: 2
                } as GameDifficultyValues;
            case GameDifficulty.Hard:
                return {
                    difficulty: difficulty,
                    batCount: 2,
                    batCarryPct: 75,
                    tunnelMax: 24,
                    numPits: 3
                } as GameDifficultyValues;
        }
    }
}