export function findPath(fromX, fromY, toX, toY, allTiles) {
    const calculateGCost = (x, y) => (Math.abs(x - fromX) + Math.abs(y - fromY) * 10);
    const calculateHCost = (x, y) => (Math.abs(x - toX) + Math.abs(y - toY) * 10);
    const createNode = (x, y) => {
        const gCost = calculateGCost(x, y);
        const hCost = calculateHCost(x, y);
        const fCost = gCost + hCost;
        const element = allTiles.find(element => element.x === x && element.y === y);
        return { x, y, element, gCost, fCost, hCost };
    };
    const checkWalkAbility = (x, y) => {
        let exists = allTiles.findIndex(element => element.x === x && element.y === y) !== -1;
        if (exists)
            return allTiles.find(element => element.x === x && element.y === y).walkable;
        return false;
    };
    const isInClosedNodes = (x, y) => {
        return closedNodes.some(element => element.x === x && element.y === y);
    };
    const isInOpenNodes = (x, y) => {
        return openNodes.some(element => element.x === x && element.y === y);
    };
    const checkParents = (x, y, current) => {
        if (!isInClosedNodes(x, y - 1) && !isInOpenNodes(x, y - 1) && checkWalkAbility(x, y - 1)) {
            let node = createNode(x, y - 1);
            node.parent = current;
            openNodes.push(node);
        }
        if (!isInClosedNodes(x - 1, y) && !isInOpenNodes(x - 1, y) && checkWalkAbility(x - 1, y)) {
            let node = createNode(x - 1, y);
            node.parent = current;
            openNodes.push(node);
        }
        if (!isInClosedNodes(x + 1, y) && !isInOpenNodes(x + 1, y) && checkWalkAbility(x + 1, y)) {
            let node = createNode(x + 1, y);
            node.parent = current;
            openNodes.push(node);
        }
        if (!isInClosedNodes(x, y + 1) && !isInOpenNodes(x, y + 1) && checkWalkAbility(x, y + 1)) {
            let node = createNode(x, y + 1);
            node.parent = current;
            openNodes.push(node);
        }
        openNodes = openNodes.sort((a, b) => a.fCost - b.fCost);
    };
    let openNodes = [];
    let closedNodes = [];
    openNodes.push(createNode(fromX, fromY));
    while (true) {
        let current = openNodes.shift();
        if (!current) {
            return null;
        }
        closedNodes.push(current);
        if (current.x === toX && current.y === toY) {
            const finale_array = [];
            let temp = current;
            while (temp) {
                finale_array.unshift(temp.element);
                temp = temp.parent;
            }
            return finale_array;
        }
        checkParents(current.x, current.y, current);
    }
}
