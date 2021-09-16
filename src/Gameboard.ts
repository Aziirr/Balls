import {GameTile} from "./GameTile";
import {GameBall} from "./GameBall"
import {findPath} from "./AStar";
import {Position, GameConfig} from "./interfaces";
import {grayBalls} from "./decorators";

class GameBoard implements GameConfig {
    public allBalls: GameBall[] = []
    public allTiles: GameTile[] = []
    public startPoint: Position
    public endPoint: Position
    public nextBallsColors: string[] = []
    // @grayBalls()
    public ballsColors: string[] = ['red', 'blue', 'purple', 'orange', 'pink', 'black', 'cyan']
    private points: number = 0

    constructor(public boardWidth:number, public boardHeight:number) {
        this.createBoard(this.boardHeight, this.boardWidth)
    }

    public addToAllBalls(element: GameBall): void {
        this.allBalls.push(element)
    }

    public addToAllTiles(element: GameTile): void {
        this.allTiles.push(element)
    }

    public findTileElement(x: number, y: number): GameTile {
        return this.allTiles.find(element => element.x == x && element.y == y)
    }

    public findBallElement(x: number, y: number): GameBall {
        return this.allBalls.find(element => element.x == x && element.y == y)
    }

    public removeBallElement(x: number, y: number): void {
        let index = this.allBalls.findIndex(element => element.x == x && element.y == y)
        if (index !== -1)
            this.allBalls.splice(index, 1)
    }


    public getBallColor(x: number, y: number): String {
        let gameBall = this.findBallElement(x, y);
        return gameBall && gameBall.color
    }

    public drawNewNextBallsColors(): void {
        this.nextBallsColors = []
        let previewBalls: HTMLCollection = document.getElementsByClassName("preview-ball")
        for (let ball = 0; ball < 3; ball++) {
            let color = this.ballsColors[Math.floor(Math.random() * this.ballsColors.length)]
            this.nextBallsColors.push(color)
            previewBalls[ball]["style"].backgroundColor = color
        }
    }

    public randomWalkablePosition(): Position {
        let freeTileFound = false
        let x: number, y: number
        while (!freeTileFound) {
            x = Math.floor(Math.random() * 9)
            y = Math.floor(Math.random() * 9)
            if (this.findTileElement(x, y).walkable)
                freeTileFound = true
        }
        return {x: x, y: y}
    }

    public addNextBalls(): void {
        for (const element of this.nextBallsColors) {
            let position: Position = this.randomWalkablePosition()
            let color = this.ballsColors[Math.floor(Math.random() * this.ballsColors.length)]
            this.newBall(position.x, position.y, color)
            if (this.allBalls.length >= 81)
                this.gameOver()
        }
        this.drawNewNextBallsColors()
    }

    public newBall(x: number, y: number, color: string): void {
        let gameBall = new GameBall(x, y, color)
        this.addToAllBalls(gameBall)
        this.findTileElement(x, y).setWalkableVariable(false)
        gameBall.checkBallsToDestroy()
    }

    public nearbyTiles(x: number, y: number): GameTile[] {
        let nearbyTiles = []
        nearbyTiles.push(gameBoard.findTileElement(x - 1, y))
        nearbyTiles.push(gameBoard.findTileElement(x + 1, y))
        nearbyTiles.push(gameBoard.findTileElement(x, y - 1))
        nearbyTiles.push(gameBoard.findTileElement(x, y + 1))
        nearbyTiles = nearbyTiles.filter(element => element != undefined)
        return nearbyTiles
    }

    public executeAStar(): GameTile[] {
        return findPath(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y, this.allTiles)
    }

    public clearSavedPoints(): void {
        this.startPoint = null
        this.endPoint = null
    }

    private static destroyBall(ball: GameBall): void {
        document.getElementById("main").removeChild(ball.element)
        gameBoard.removeBallElement(ball.x, ball.y)
        gameBoard.findTileElement(ball.x, ball.y).setWalkableVariable(true)
    }

    public destroyBalls(ballsToDestroy: GameBall[]) {
        for (const element of ballsToDestroy)
            GameBoard.destroyBall(element)
        this.updatePoints(ballsToDestroy.length)
    }

    private updatePoints(addPoints: number): void {
        this.points += addPoints
        document.getElementById("points").innerText = "Twoje punkty: " + this.points
    }

    private gameOver(): void {
        alert("Przegrałeś, Twoja liczba punktów: " + this.points)
        location.reload()
    }

    private createBoard(rows: number, columns: number): void {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                let gameTile = new GameTile(column, row)
                this.addToAllTiles(gameTile)
            }
        }
        this.drawNewNextBallsColors()
        this.addNextBalls()
    }

}

export const gameBoard = new GameBoard(9, 9)
export default gameBoard