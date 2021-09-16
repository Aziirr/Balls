import {GameTile} from "./GameTile";
import gameBoard from "./Gameboard";

export function clearPath(): void {
    for (const element of gameBoard.allTiles) {
        element.element.style.backgroundColor = "blueviolet"
    }
}

export function highlightPath(tilesToHighlight: GameTile[], color: string): void {
    if (tilesToHighlight)
        for (const element of tilesToHighlight) {
            element.element.style.backgroundColor = color
        }
}