import gameBoard from "./Gameboard";
import {clearPath, highlightPath} from "./VisualEffects";

export class GameTile {
    public color: string | null
    public width: number = 40
    public height: number = 40
    public element: HTMLElement = document.createElement("div")
    public walkable: boolean = true

    constructor(public x: number, public y: number) {
        this.setElementPosition()
        this.addOnClick()
        this.addOnMouseOver()
    }

    public setWalkableVariable(value: boolean): void {
        this.walkable = value

    }

    private setElementPosition(): void {
        this.element.style.left = (this.x * this.width) + 'px'
        this.element.style.top = (this.y * this.width) + 'px'
        this.element.classList.add('tile')
        let main_div = document.getElementById("main")
        main_div.appendChild(this.element)
    }

    private addOnClick(): void {
        this.element.addEventListener('click', () => {
            if (gameBoard.startPoint && this.walkable) {
                gameBoard.endPoint = {x: this.x, y: this.y}
                if(gameBoard.executeAStar()) {
                    let ball = gameBoard.findBallElement(gameBoard.startPoint.x, gameBoard.startPoint.y)
                    let destroyed = ball.moveBall(this.x, this.y)
                    if (!destroyed) {
                        gameBoard.addNextBalls()
                        gameBoard.drawNewNextBallsColors()
                    }
                }
                else
                    gameBoard.endPoint = undefined
            }
        })
    }

    private addOnMouseOver(): void {
        this.element.addEventListener("mouseover", () => {
            if (gameBoard.startPoint && this.walkable) {
                gameBoard.endPoint = {x: this.x, y: this.y}
                clearPath()
                highlightPath(gameBoard.executeAStar(), "green")
            }
        })
    }


}