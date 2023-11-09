import { Random } from "./random";
import { Cavern } from "./cavern";
import { Direction } from "./direction";

export default class EndGameMessages {
    private _random: Random;

    constructor(random: Random) {
        this._random = random;
    }

    public getMealDescription(): string {
        const hours = new Date().getHours();

        if (hours < 1) {
            return " a midnight snack.";
        }
        if (hours < 6) {
            return " a late night snack.";
        }
        if (hours < 10) {
            return " breakfast.";
        }
        if (hours < 12) {
            return " brunch.";
        }
        if (hours < 16) {
            return " lunch.";
        }
        if (hours < 18) {
            return " an early dinner.";
        }
        if (hours < 21) {
            return " dinner.";
        }
        return " a snack.";
    }

    public getEatenDescription(): string {
        switch (this._random.nextMax(4)) {
            case 0:
                return "You see the fearsome Wumpus, but before you can draw your bow, you are devoured for" + this.getMealDescription();
            case 1:
                return "As you are distracted by the blood splattered all around, the fearsome Wumpus sneaks up from behind and devours you for" + this.getMealDescription();
            case 2:
                return "Without paying attention you've walked right into the fearsome Wumpus' lair. It devours you for" + this.getMealDescription();
            default:
                return "You stumble upon the fearsome Wumpus and are devoured for" + this.getMealDescription();
        }
    }

    public getPitDescription(): string {
        switch (this._random.nextMax(3)) {
            case 0:
                return "You have fallen into a bottomless pit. At least you don't have the fearsome Wumpus to worry about anymore.";
            case 1:
                return "You trip into a bottomless pit. Unfortunately, there is no bat around to save you.";
            default:
                return "You have fallen into a bottomless pit. After falling for several hours, you think it might have been better to have been eaten by the fearsome Wumpus.";
        }
    }

    public getMissedDescription(cavern: Cavern, direction: Direction): string {
        const noise = "he noise attracts the Wumpus and you are devoured for" + this.getMealDescription();

        if (!cavern.getAdjacent(direction)) {
            return "You take careful aim and fire your arrow directly into a wall. T" + noise + " What were you thinking?";
        }

        if (!cavern.hasBlood) {
            return "The fearsome Wumpus wasn't there. In fact there was no sign the fearsome Wumpus was nearby. However, t" + noise;
        }

        switch (this._random.nextMax(2)) {
            case 0:
                return "Close but no cigar; maybe next time.  Only there won't be a next time because t" + noise;
            default:
                return "That wasn't where the fearsome Wumpus was. T" + noise;
        }
    }

    public getVictoryDescription(): string {
        switch (this._random.nextMax(5)) {
            case 0:
                return "You've killed the fearsome Wumpus. Doesn't seem so fearsome now.";
            case 1:
                return "You've killed the fearsome Wumpus. I hope you had a hunting license.";
            case 2:
                return "The fearsome Wumpus lies dead before you. Now how do you get out of here...";
            case 3:
                return "Your arrow strikes true and slays the fearsome Wumpus. You are hailed a hero and become a legend in your own time.";
            default: {
                let body: string;

                switch (this._random.nextMax(6)) {
                    case 0:
                        body = "black heart";
                        break
                    case 1:
                        body = "misshapen head";
                        break
                    case 2:
                        body = "thick neck";
                        break
                    case 3:
                        body = "broad, muscular chest";
                        break
                    case 4:
                        body = "distended belly";
                        break
                    default:
                        body = "knee";
                        break
                }

                return `With a twang from your bow, your trusty arrow streaks through the air and strikes the fearsome Wumpus in its ${body}. The fearsome Wumpus bellows in pain and anguish before slumping to the ground. Its cries turn into whimpers and after a few minutes, the once fearsome Wumpus breathes one last time and then lies silent. ${body === "knee" ? "Really, the knee? Who knew that was the fearsome Wumpus' weak spot?" : ""}`;
            }
        }
    }
}