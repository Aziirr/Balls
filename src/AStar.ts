import {GameTile} from './GameTile'
import {Node} from "./interfaces";


export function findPath(fromX: number, fromY: number,
                         toX: number, toY: number, allTiles: GameTile[]): GameTile[] {

    const createNode = (x: number, y: number): Node => {
        const gCost = Math.abs(x - fromX) + Math.abs(y - fromY)
        const hCost = Math.abs(x - toX) + Math.abs(y - toY)
        const fCost = gCost + hCost
        const element = allTiles.find(element => element.x === x && element.y === y)
        return {x, y, element, gCost, fCost, hCost}
    }

    const checkWalkAbility = (x: number, y: number): boolean => {
        let exists = allTiles.findIndex(element => element.x === x && element.y === y) !== -1
        if (exists)
            return allTiles.find(element => element.x === x && element.y === y).walkable
        return false
    }

    const isInClosedNodes = (x: number, y: number): boolean => {
        return closedNodes.some(element => element.x === x && element.y === y)
    }

    const isInOpenNodes = (x: number, y: number): boolean => {
        return openNodes.some(element => element.x === x && element.y === y)
    }


    const checkNearby = (x: number, y: number, current: Node) => {
        if (!isInClosedNodes(x, y - 1) && !isInOpenNodes(x, y - 1) && checkWalkAbility(x, y - 1)) {
            let node = createNode(x, y - 1)
            node.parent = current
            openNodes.push(node)
        }
        if (!isInClosedNodes(x - 1, y) && !isInOpenNodes(x - 1, y) && checkWalkAbility(x - 1, y)) {
            let node = createNode(x - 1, y)
            node.parent = current
            openNodes.push(node)
        }
        if (!isInClosedNodes(x + 1, y) && !isInOpenNodes(x + 1, y) && checkWalkAbility(x + 1, y)) {
            let node = createNode(x + 1, y)
            node.parent = current
            openNodes.push(node)
        }
        if (!isInClosedNodes(x, y + 1) && !isInOpenNodes(x, y + 1) && checkWalkAbility(x, y + 1)) {
            let node = createNode(x, y + 1)
            node.parent = current
            openNodes.push(node)
        }
        openNodes = openNodes.sort((a, b) => a.fCost - b.fCost)

    }

    let openNodes: Node[] = []
    let closedNodes: Node[] = []


    openNodes.push(createNode(fromX, fromY))

    while (true) {
        let current = openNodes.shift()
        if (!current) {
            return null
        }
        closedNodes.push(current)

        if (current.x === toX && current.y === toY) {
            const finale_array: GameTile[] = []
            let temp: Node = current
            while (temp) {
                finale_array.unshift(temp.element)
                temp = temp.parent
            }
            return finale_array
        }
        checkNearby(current.x, current.y, current)
    }
}

