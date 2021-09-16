import gameBoard from "./Gameboard";
import {Position} from "./interfaces";
import {clearPath, highlightPath} from "./VisualEffects";
import {heheszki} from "./decorators";

export class GameBall {
    public element: HTMLElement = document.createElement("div")
    private clicked: boolean = false

    constructor(public x: number, public y: number, public color: string) {
        this.createElement(this.x, this.y, this.color)
        this.addOnClick()
    }

    public setElementPosition(x: number, y: number): void {
        this.x = x
        this.y = y
        this.element.style.left = (x * 40) + 6 + 'px'
        this.element.style.top = (y * 40) + 6 + 'px'
    }

    private createElement(x: number, y: number, color: string): void {
        this.element.style.left = (x * 40) + 6 + 'px'
        this.element.style.top = (y * 40) + 6 + 'px'
        this.element.style.backgroundColor = color
        this.element.classList.add('ball')
        let main_div = document.getElementById("main")
        main_div.appendChild(this.element)
    }
    // @heheszki()
    private static clearCurrentBall(ballPosition: Position): void {
        let selectedBall = gameBoard.findBallElement(ballPosition.x, ballPosition.y)
        selectedBall.element.style.transform = "scale(1)"
        gameBoard.clearSavedPoints()
    }

    public checkIfMoveIsPossible(x: number, y: number): boolean {
        for (const element of gameBoard.nearbyTiles(x, y))
            if (element.walkable)
                return true
        return false
    }
    private addOnClick(): void {
        this.element.addEventListener('click', () => {
            if (this.checkIfMoveIsPossible(this.x, this.y)) {
                if (gameBoard.startPoint)
                    GameBall.clearCurrentBall(gameBoard.startPoint)
                if (!this.clicked) {
                    gameBoard.startPoint = {x: this.x, y: this.y}
                    this.element.style.transform = 'scale(1.2)'
                    this.clicked = true
                }
                else
                    this.clicked = false
                clearPath()
            }
        })
    }
    public moveBall(x: number, y: number): boolean {
        this.setElementPosition(x, y)
        let tiles = gameBoard.executeAStar()
        highlightPath(tiles, "red")
        setTimeout(() => {
            clearPath()
        }, 1000)
        let startTile = tiles[0]
        startTile.setWalkableVariable(true)
        let endTile = tiles[tiles.length - 1]
        endTile.setWalkableVariable(false)
        this.clicked = false
        GameBall.clearCurrentBall({x, y})
        return this.checkBallsToDestroy()
    }

    public checkBallsToDestroy() {
        if (gameBoard) {
            const row = this.checkRow()
            const column = this.checkColumn()
            const firstBias = this.checkFirstBias()
            const secondBias = this.checkSecondBias()
            const allBalls = [...new Set([...row, ...column, ...firstBias, ...secondBias])]
            let allBallsExists = allBalls.length > 0
            if (allBallsExists) {
                gameBoard.destroyBalls(allBalls)
                return true
            }
            return false
        }
    }

    private checkRow() {
        let y: number = this.y
        let color: string = this.color
        let balls: GameBall[] = []
        for (let x = 0; x < 9; x++) {
            if (gameBoard.getBallColor(x, y) === color) {
                balls.push(gameBoard.findBallElement(x, y))
            } else if (balls.length >= 5)
                break
            else
                balls = []
        }
        if (balls.length < 5)
            balls = []

        return balls
    }

    private checkColumn() {
        let x: number = this.x
        let color: string = this.color
        let balls: GameBall[] = []
        for (let y = 0; y < 9; y++) {
            if (gameBoard.getBallColor(x, y) === color) {
                balls.push(gameBoard.findBallElement(x, y))
            } else if (balls.length >= 5)
                break
            else
                balls = []
        }
        if (balls.length < 5)
            balls = []

        return balls
    }

    private checkFirstBias() {
        let x: number = this.x
        let y: number = this.y
        while (x > 0 && y !== 0) {
            x--
            y--
        }
        let color: string = this.color
        let balls: GameBall[] = []
        while (x < 9 && y < 9) {
            if (gameBoard.getBallColor(x, y) === color) {
                balls.push(gameBoard.findBallElement(x, y))
            } else if (balls.length >= 5)
                break
            else
                balls = []
            x++
            y++
        }
        if (balls.length < 5)
            balls = []

        return balls
    }

    private checkSecondBias() {
        let x = this.x
        let y = this.y
        while (x > 0 && y !== 8) {
            x--
            y++
        }
        let color: string = this.color
        let balls: GameBall[] = []
        while (x < 9 && y >= 0) {
            if (gameBoard.getBallColor(x, y) === color) {
                balls.push(gameBoard.findBallElement(x, y))
            } else if (balls.length >= 5)
                break
            else
                balls = []
            x++
            y--
        }
        if (balls.length < 5)
            balls = []

        return balls
    }
}