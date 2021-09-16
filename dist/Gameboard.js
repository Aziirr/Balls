import { GameTile } from "./GameTile";
import { GameBall } from "./GameBall";
import { findPath } from "./AStar";
class GameBoard {
    constructor(boardWidth, boardHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.allBalls = [];
        this.allTiles = [];
        this.nextBallsColors = [];
        // @grayBalls()
        this.ballsColors = ['red', 'blue', 'purple', 'orange', 'pink', 'black', 'cyan'];
        this.points = 0;
        this.createBoard(this.boardHeight, this.boardWidth);
    }
    addToAllBalls(element) {
        this.allBalls.push(element);
    }
    addToAllTiles(element) {
        this.allTiles.push(element);
    }
    findTileElement(x, y) {
        return this.allTiles.find(element => element.x == x && element.y == y);
    }
    findBallElement(x, y) {
        return this.allBalls.find(element => element.x == x && element.y == y);
    }
    removeBallElement(x, y) {
        let index = this.allBalls.findIndex(element => element.x == x && element.y == y);
        if (index !== -1)
            this.allBalls.splice(index, 1);
    }
    getBallColor(x, y) {
        let gameBall = this.findBallElement(x, y);
        return gameBall && gameBall.color;
    }
    drawNewNextBallsColors() {
        this.nextBallsColors = [];
        let previewBalls = document.getElementsByClassName("preview-ball");
        for (let ball = 0; ball < 3; ball++) {
            let color = this.ballsColors[Math.floor(Math.random() * this.ballsColors.length)];
            this.nextBallsColors.push(color);
            previewBalls[ball]["style"].backgroundColor = color;
        }
    }
    randomWalkablePosition() {
        let freeTileFound = false;
        let x, y;
        while (!freeTileFound) {
            x = Math.floor(Math.random() * 9);
            y = Math.floor(Math.random() * 9);
            if (this.findTileElement(x, y).walkable)
                freeTileFound = true;
        }
        return { x: x, y: y };
    }
    addNextBalls() {
        for (const element of this.nextBallsColors) {
            let position = this.randomWalkablePosition();
            let color = this.ballsColors[Math.floor(Math.random() * this.ballsColors.length)];
            this.newBall(position.x, position.y, color);
            if (this.allBalls.length >= 81)
                this.gameOver();
        }
        this.drawNewNextBallsColors();
    }
    newBall(x, y, color) {
        let gameBall = new GameBall(x, y, color);
        this.addToAllBalls(gameBall);
        this.findTileElement(x, y).setWalkableVariable(false);
        gameBall.checkBallsToDestroy();
    }
    nearbyTiles(x, y) {
        let nearbyTiles = [];
        nearbyTiles.push(gameBoard.findTileElement(x - 1, y));
        nearbyTiles.push(gameBoard.findTileElement(x + 1, y));
        nearbyTiles.push(gameBoard.findTileElement(x, y - 1));
        nearbyTiles.push(gameBoard.findTileElement(x, y + 1));
        nearbyTiles = nearbyTiles.filter(element => element != undefined);
        return nearbyTiles;
    }
    executeAStar() {
        return findPath(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y, this.allTiles);
    }
    clearSavedPoints() {
        this.startPoint = null;
        this.endPoint = null;
    }
    static destroyBall(ball) {
        document.getElementById("main").removeChild(ball.element);
        gameBoard.removeBallElement(ball.x, ball.y);
        gameBoard.findTileElement(ball.x, ball.y).setWalkableVariable(true);
    }
    destroyBalls(ballsToDestroy) {
        for (const element of ballsToDestroy)
            GameBoard.destroyBall(element);
        this.updatePoints(ballsToDestroy.length);
    }
    updatePoints(addPoints) {
        this.points += addPoints;
        document.getElementById("points").innerText = "Twoje punkty: " + this.points;
    }
    gameOver() {
        alert("Przegrałeś, Twoja liczba punktów: " + this.points);
        location.reload();
    }
    createBoard(rows, columns) {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                let gameTile = new GameTile(column, row);
                this.addToAllTiles(gameTile);
            }
        }
        this.drawNewNextBallsColors();
        this.addNextBalls();
    }
}
export const gameBoard = new GameBoard(9, 9);
export default gameBoard;
