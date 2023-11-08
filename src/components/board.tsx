import { memo } from "react";
import { Map } from "../engine/map";
import Cell from "./cell";

interface BoardProps {
    key: React.Key,
    map: Map,
}

const Board: React.FC<BoardProps> = memo(({ map }) => {
    const cells = [];

    for (let y = 0; y < map.MapHeight; y++) {
        for (let x = 0; x < map.MapWidth; x++) {
            cells.push(Cell({ cavern: map.getCavern(x, y) }));
        }
    }

    return (
        <div className="board-grid">
            {cells}
        </div>
    );
});

export default Board;
