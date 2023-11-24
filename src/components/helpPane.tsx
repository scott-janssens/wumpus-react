import titleH from "../assets/TitleH.png";
import titleV from "../assets/TitleV.png";
import { Engine } from "../engine/engine";
import { getBatIcon, getCavernIcon, getPlayerIcon, getWumpusIcon } from "./icons";
import { Cavern } from "../engine/cavern";
import { Location } from "../engine/location";
import { useState } from "react";
import { GameDifficulty } from "../engine/gameDifficulty";

interface HelpProps {
    engine: Engine,
    isHorizontal: boolean,
    onNewGame: (difficulty: GameDifficulty) => void
}

const HelpPane: React.FC<HelpProps> = ({ engine, isHorizontal, onNewGame }) => {
    const [difficulty, setDifficulty] = useState(engine.map.gameDifficultyValues.difficulty.toString());

    const bloodCavern = new Cavern(new Location(0, 0));
    bloodCavern.hasBlood = true;
    bloodCavern.north = bloodCavern.east = bloodCavern.south = bloodCavern.west = bloodCavern;

    const pitWarnCavern = new Cavern(new Location(0, 0));
    pitWarnCavern.isAdjacentPit = true;
    pitWarnCavern.north = pitWarnCavern.east = pitWarnCavern.south = pitWarnCavern.west = pitWarnCavern;

    const pitCavern = new Cavern(new Location(0, 0));
    pitCavern.isPit = true;
    pitCavern.north = pitCavern.east = pitCavern.south = pitCavern.west = pitCavern;

    const description1 = "You are a hunter exploring caverns in search of the fearsome Wumpus. " +
        "If you enter the same cavern as the Wumpus, the Wumpus will eat you. There are clues to where the Wumpus is in the form " +
        "of blood splatters within two spaces of the Wumpus (not including tunnels). " +
        "Beware of giant bats which can carry you to random locations and bottomless pits.";
    const description2 = "Use the ARROW keys to move. When you are adjacent to where you have deduced the Wumpus must be, press " +
        "SPACE to fire your arrow. You have only one arrow with which to kill the Wumpus. " + 
        "On mobile devices you can swipe for direction or double tap and swipe to fire your arrow.";

    const getDescription = () => {
        return (<div><p>{description1}</p><p>{description2}</p></div>);
    }

    let getHelpGrid = () => {
        return (
            <div className="help-grid">
                <div className="relative">
                    <div>
                        {getPlayerIcon(null, 100, 100)}
                    </div>
                    <div className="help-grid-tag">
                        You
                    </div>
                </div>
                <div className="relative">
                    <div>
                        {getCavernIcon(pitWarnCavern, 80, 80, "lemonchiffon")}
                    </div>
                    <div className="help-grid-tag">
                        bottomless Pit Adjacent
                    </div>
                </div>
                <div className="relative">
                    <div>
                        {getBatIcon(100, 100)}
                    </div>
                    <div className="help-grid-tag">
                        Giant Bat
                    </div>
                </div>
                <div className="relative">
                    <div>
                        {getCavernIcon(pitCavern, 80, 80, "lemonchiffon")}
                    </div>
                    <div className="help-grid-tag">
                        bottomless Pit
                    </div>
                </div>
                <div className="relative">
                    <div>
                        {getWumpusIcon(100, 100)}
                    </div>
                    <div className="help-grid-tag">
                        Fearsome Wumpus
                    </div>
                </div>
                <div className="relative">
                    <div>
                        {getCavernIcon(bloodCavern, 80, 80, "lemonchiffon")}
                    </div>
                    <div className="help-grid-tag">
                        Blood Spattered Cavern
                    </div>
                </div>
            </div>
        );
    }

    const gameControls = () => {
        return (
            <div className="centeringContainer">
                <div className="gameControls">
                    <select className="selectbox" name="difficulty-select" title="Difficulty" value={difficulty.toString()} onChange={e => setDifficulty(e.target.value)}>
                        <option value="0">Easy</option>
                        <option value="1">Normal</option>
                        <option value="2">Hard</option>
                    </select>
                    <button id="newGameBtn" className="button" onClick={(e) => {
                        onNewGame(Number(difficulty) as GameDifficulty);
                        (document.activeElement as HTMLElement).blur();
                    }}>New Game</button>
                    <a className="code-link" href="https://github.com/scott-janssens/wumpus-react">Source Code</a>
                </div>
            </div>
        );
    };

    if (isHorizontal) {
        return (
            <div className="help help-horizontal">
                <img className="title-horizontal" src={titleH} alt="Title Wumpus" />
                {getDescription()}
                {getHelpGrid()}
                {gameControls()}
            </div>
        );
    }

    return (
        <div className="help help-vertical">
            <img className="title-vertical" src={titleV} alt="Title Wumpus" />
            <div className="help-vertical-description">
                {getDescription()}
                {gameControls()}
            </div>
            {getHelpGrid()}
        </div>
    );
};

export default HelpPane