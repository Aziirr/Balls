import {GameTile} from "./GameTile";

export interface GameConfig {
    readonly boardWidth: number,
    readonly boardHeight: number,
    ballsColors: string[]
}

export interface Position {
    x: number,
    y: number,
}

export interface Node {
    x: number,
    y: number,
    fCost: number,
    gCost: number,
    hCost: number,
    element: GameTile,
    parent?: Node,
}