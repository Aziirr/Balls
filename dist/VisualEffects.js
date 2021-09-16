import gameBoard from "./Gameboard";
export function clearPath() {
    for (const element of gameBoard.allTiles) {
        element.element.style.backgroundColor = "blueviolet";
    }
}
export function highlightPath(tilesToHighlight, color) {
    if (tilesToHighlight)
        for (const element of tilesToHighlight) {
            element.element.style.backgroundColor = color;
        }
}
