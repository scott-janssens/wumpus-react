import { useEffect, useState } from "react";
import { Cavern } from "../engine/cavern";
import SvgHelper from "../helpers/svgHelper";
import { Direction } from "../engine/direction";
import { getCavernIcon, getPlayerIcon } from "./icons";

interface CellProps {
    cavern: Cavern
}

const Cell: React.FC<CellProps> = ({ cavern }) => {
    const [state, setState] = useState(0)

    useEffect(() => {
        cavern.onUpdated.subscribe(update);

        return () => {
            cavern.onUpdated.unsubscribe(update);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const update = () => {
        setState(state + 1);
    }

    let svg = new SvgHelper();
    let key = cavern.location.y * 8 + cavern.location.x;
    let cellColor = "brown";

    // uncomment to reveal map for debugging
    //cavern.reveal();

    if (!cavern.isRevealed) {
        return (<div key={key} className="cell"></div>);
    }

    if (cavern.isCave) {
        return (
            <div key={key} className="cell">
                {getCavernIcon(cavern)}
            </div>);
    }

    if (cavern.exitCount() === 4) {
        return (
            <div key={key} className="cell">
                <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                    <path d={svg.describeArc(0, 0, 60, 90, 180)} stroke={cellColor} fill='none' strokeWidth='5' />
                    <path d={svg.describeArc(0, 0, 90, 90, 180)} stroke={cellColor} fill='none' strokeWidth='5' />
                    <path d={svg.describeArc(150, 150, 60, 270, 0)} stroke={cellColor} fill='none' strokeWidth='5' />
                    <path d={svg.describeArc(150, 150, 90, 270, 0)} stroke={cellColor} fill='none' strokeWidth='5' />

                    {cavern.playerDirection === Direction.North || cavern.playerDirection === Direction.West
                        ? getPlayerIcon(cavern, 150, 150, -6, -8)
                        : getPlayerIcon(cavern, 150, 150, 6, 8)}
                </svg>
            </div>);
    }

    if (cavern.north !== undefined && cavern.south !== undefined) {
        return (
            <div key={key} className="cell">
                <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                    <line x1="60" y1="0" x2="60" y2="150" stroke={cellColor} strokeWidth="5" />
                    <line x1="90" y1="0" x2="90" y2="150" stroke={cellColor} strokeWidth="5" />

                    {getPlayerIcon(cavern)}
                </svg>
            </div>);
    }

    if (cavern.east !== undefined && cavern.west !== undefined) {
        return (
            <div key={key} className="cell">
                <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                    <path d={svg.describeArc(75, 75, 15, -15, 15)} stroke='white' fill='none' strokeWidth='5' />
                    <line x1="0" y1="60" x2="150" y2="60" stroke={cellColor} strokeWidth="5" />
                    <line x1="0" y1="90" x2="150" y2="90" stroke={cellColor} strokeWidth="5" />

                    {getPlayerIcon(cavern)}
                </svg>
            </div>);
    }


    let startX = 0;
    let startY = 0;
    let arcStart = 90;
    let arcEnd = 180;
    let offsetX = 6;
    let offsetY = 6;

    if (cavern.north && cavern.east) {
        startX = 150;
        startY = 0;
        arcStart = 180;
        arcEnd = 270;
        offsetX = -6;
        offsetY = 6;
    }
    else if (cavern.south && cavern.east) {
        startX = 150;
        startY = 150;
        arcStart = 270;
        arcEnd = 0;
        offsetX = -6;
        offsetY = -6;
    }
    else if (cavern.south && cavern.west) {
        startX = 0;
        startY = 150;
        arcStart = 0;
        arcEnd = 90;
        offsetX = 6;
        offsetY = -6;
    }

    return (
        <div key={key} className="cell">
            <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <path d={svg.describeArc(startX, startY, 60, arcStart, arcEnd)} stroke={cellColor} fill='none' strokeWidth='5' />
                <path d={svg.describeArc(startX, startY, 90, arcStart, arcEnd)} stroke={cellColor} fill='none' strokeWidth='5' />

                {getPlayerIcon(cavern, 150, 150, offsetX, offsetY)}
            </svg>
        </div>);

};

export default Cell;