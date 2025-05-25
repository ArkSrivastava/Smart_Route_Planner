// Algorithms class to implement different pathfinding algorithms
class Algorithms {
    constructor(grid) {
        this.grid = grid;
    }

    // Dijkstra's Algorithm
    dijkstra(startNode, endNode) {
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        const unvisitedNodes = this.getAllNodes();
        
        while (unvisitedNodes.length) {
            // Sort unvisited nodes by distance
            this.sortNodesByDistance(unvisitedNodes);
            
            // Get the closest node
            const closestNode = unvisitedNodes.shift();
            
            // If we encounter a wall, skip it
            if (closestNode.isWall) continue;
            
            // If the closest node has a distance of infinity, we're trapped
            if (closestNode.distance === Infinity) return visitedNodesInOrder;
            
            // Mark the node as visited
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            
            // If we've reached the end node, we're done
            if (closestNode === endNode) return visitedNodesInOrder;
            
            // Update all neighbors
            this.updateUnvisitedNeighbors(closestNode);
        }
        
        return visitedNodesInOrder;
    }

    // A* Search Algorithm
    astar(startNode, endNode) {
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        startNode.g = 0;
        startNode.h = this.heuristic(startNode, endNode);
        startNode.f = startNode.h;
        const unvisitedNodes = this.getAllNodes();
        
        while (unvisitedNodes.length) {
            // Sort unvisited nodes by f value (g + h)
            this.sortNodesByFScore(unvisitedNodes);
            
            // Get the node with the lowest f value
            const currentNode = unvisitedNodes.shift();
            
            // If we encounter a wall, skip it
            if (currentNode.isWall) continue;
            
            // If the current node has an f value of infinity, we're trapped
            if (currentNode.f === Infinity) return visitedNodesInOrder;
            
            // Mark the node as visited
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);
            
            // If we've reached the end node, we're done
            if (currentNode === endNode) return visitedNodesInOrder;
            
            // Update all neighbors for A*
            this.updateNeighborsAstar(currentNode, endNode, unvisitedNodes);
        }
        
        return visitedNodesInOrder;
    }

    // Breadth-First Search Algorithm
    bfs(startNode, endNode) {
        const visitedNodesInOrder = [];
        const queue = [startNode];
        startNode.isVisited = true;
        visitedNodesInOrder.push(startNode);
        
        while (queue.length) {
            const currentNode = queue.shift();
            
            // If we've reached the end node, we're done
            if (currentNode === endNode) return visitedNodesInOrder;
            
            // Get all neighbors
            const neighbors = this.grid.getNeighbors(currentNode);
            
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited && !neighbor.isWall) {
                    neighbor.isVisited = true;
                    neighbor.previousNode = currentNode;
                    visitedNodesInOrder.push(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        return visitedNodesInOrder;
    }

    // Depth-First Search Algorithm
    dfs(startNode, endNode) {
        const visitedNodesInOrder = [];
        const stack = [startNode];
        startNode.isVisited = true;
        visitedNodesInOrder.push(startNode);
        
        while (stack.length) {
            const currentNode = stack.pop();
            
            // If we've reached the end node, we're done
            if (currentNode === endNode) return visitedNodesInOrder;
            
            // Get all neighbors
            const neighbors = this.grid.getNeighbors(currentNode);
            
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited && !neighbor.isWall) {
                    neighbor.isVisited = true;
                    neighbor.previousNode = currentNode;
                    visitedNodesInOrder.push(neighbor);
                    stack.push(neighbor);
                }
            }
        }
        
        return visitedNodesInOrder;
    }

    // Helper method to get all nodes in the grid
    getAllNodes() {
        const nodes = [];
        for (const row of this.grid.grid) {
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    // Helper method to sort nodes by distance
    sortNodesByDistance(nodes) {
        nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }

    // Helper method to sort nodes by f score (for A*)
    sortNodesByFScore(nodes) {
        nodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
    }

    // Helper method to update unvisited neighbors (for Dijkstra)
    updateUnvisitedNeighbors(node) {
        const neighbors = this.grid.getNeighbors(node);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.distance = node.distance + 1;
                neighbor.previousNode = node;
            }
        }
    }

    // Helper method to update neighbors for A*
    updateNeighborsAstar(node, endNode, unvisitedNodes) {
        const neighbors = this.grid.getNeighbors(node);
        
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                // Calculate g score (distance from start)
                const tentativeG = node.g + 1;
                
                // If this path to neighbor is better than any previous one
                if (tentativeG < neighbor.g) {
                    neighbor.previousNode = node;
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }
    }

    // Heuristic function for A* (Manhattan distance)
    heuristic(nodeA, nodeB) {
        return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
    }

    // Get the shortest path from visited nodes
    getNodesInShortestPathOrder(endNode) {
        const nodesInShortestPathOrder = [];
        let currentNode = endNode;
        
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        
        return nodesInShortestPathOrder;
    }

    // Run the selected algorithm
    runAlgorithm(algorithm, startNode, endNode) {
        let visitedNodesInOrder;
        
        // Reset all nodes before running algorithm
        this.resetNodes();
        
        // Run the selected algorithm
        switch (algorithm) {
            case 'dijkstra':
                visitedNodesInOrder = this.dijkstra(startNode, endNode);
                break;
            case 'astar':
                visitedNodesInOrder = this.astar(startNode, endNode);
                break;
            case 'bfs':
                visitedNodesInOrder = this.bfs(startNode, endNode);
                break;
            case 'dfs':
                visitedNodesInOrder = this.dfs(startNode, endNode);
                break;
            default:
                visitedNodesInOrder = this.dijkstra(startNode, endNode);
        }
        
        // Get the shortest path
        const nodesInShortestPathOrder = this.getNodesInShortestPathOrder(endNode);
        
        // Calculate distance traveled
        const distanceTraveled = {
            visited: visitedNodesInOrder.length,
            path: nodesInShortestPathOrder.length,
            pathDistance: nodesInShortestPathOrder.length > 0 ? nodesInShortestPathOrder.length - 1 : 0
        };
        
        return { visitedNodesInOrder, nodesInShortestPathOrder, distanceTraveled };
    }

    // Reset all nodes before running an algorithm
    resetNodes() {
        for (const row of this.grid.grid) {
            for (const node of row) {
                node.isVisited = false;
                node.distance = Infinity;
                node.previousNode = null;
                node.f = Infinity;
                node.g = Infinity;
                node.h = Infinity;
            }
        }
    }
}

// Export the Algorithms class
window.Algorithms = Algorithms;