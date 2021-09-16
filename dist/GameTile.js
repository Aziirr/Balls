import gameBoard from "./Gameboard";
import { clearPath, highlightPath } from "./VisualEffects";
export class GameTile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.width = 40;
        this.height = 40;
        this.element = document.createElement("div");
        this.walkable = true;
        this.setElementPosition();
        this.addOnClick();
        this.addOnMouseOver();
    }
    setWalkableVariable(value) {
        this.walkable = value;
    }
    setElementPosition() {
        this.element.style.left = (this.x * this.width) + 'px';
        this.element.style.top = (this.y * this.width) + 'px';
        this.element.classList.add('tile');
        let main_div = document.getElementById("main");
        main_div.appendChild(this.element);
    }
    addOnClick() {
        this.element.addEventListener('click', () => {
            if (gameBoard.startPoint && this.walkable) {
                gameBoard.endPoint = { x: this.x, y: this.y };
                if (gameBoard.executeAStar()) {
                    let ball = gameBoard.findBallElement(gameBoard.startPoint.x, gameBoard.startPoint.y);
                    let destroyed = ball.moveBall(this.x, this.y);
                    if (!destroyed) {
                        gameBoard.addNextBalls();
                        gameBoard.drawNewNextBallsColors();
                    }
                }
                else
                    gameBoard.endPoint = undefined;
            }
        });
    }
    addOnMouseOver() {
        this.element.addEventListener("mouseover", () => {
            if (gameBoard.startPoint && this.walkable) {
                gameBoard.endPoint = { x: this.x, y: this.y };
                clearPath();
                highlightPath(gameBoard.executeAStar(), "green");
            }
        });
    }
}
