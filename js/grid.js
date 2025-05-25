// Grid class to handle the grid creation and node interactions
class Grid {
    constructor(rows = 20, cols = 25) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.startNode = null;
        this.endNode = null;
        this.isMousePressed = false;
        this.currentNodeType = 'wall'; // Default node type to create on drag
        this.gridElement = document.getElementById('grid');
        this.initializeGrid();
    }

    // Initialize the grid with nodes
    initializeGrid() {
        // Clear the grid element
        this.gridElement.innerHTML = '';
        this.grid = [];

        // Set grid template based on rows and columns
        this.gridElement.style.gridTemplateRows = `repeat(${this.rows}, 25px)`;
        this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 25px)`;

        // Create nodes for the grid
        for (let row = 0; row < this.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.cols; col++) {
                const node = this.createNode(row, col);
                currentRow.push(node);
                this.gridElement.appendChild(node.element);
            }
            this.grid.push(currentRow);
        }

        // Set default start and end nodes
        this.setStartNode(Math.floor(this.rows / 2), Math.floor(this.cols / 4));
        this.setEndNode(Math.floor(this.rows / 2), Math.floor(3 * this.cols / 4));

        // Add event listeners for mouse interactions
        this.addMouseEventListeners();
    }

    // Create a node object with its properties and DOM element
    createNode(row, col) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.id = `node-${row}-${col}`;
        
        const node = {
            row,
            col,
            isStart: false,
            isEnd: false,
            isWall: false,
            isVisited: false,
            distance: Infinity,
            previousNode: null,
            element: nodeElement,
            f: Infinity, // For A* algorithm
            g: Infinity, // For A* algorithm
            h: Infinity  // For A* algorithm
        };

        // Store node reference in the DOM element for easy access
        nodeElement.node = node;

        return node;
    }

    // Set a node as the start node
    setStartNode(row, col) {
        // Clear previous start node if exists
        if (this.startNode) {
            this.startNode.isStart = false;
            this.startNode.element.classList.remove('start');
        }

        const node = this.grid[row][col];
        node.isStart = true;
        node.element.classList.add('start');
        this.startNode = node;
    }

    // Set a node as the end node
    setEndNode(row, col) {
        // Clear previous end node if exists
        if (this.endNode) {
            this.endNode.isEnd = false;
            this.endNode.element.classList.remove('end');
        }

        const node = this.grid[row][col];
        node.isEnd = true;
        node.element.classList.add('end');
        this.endNode = node;
    }

    // Toggle wall status for a node
    toggleWall(node) {
        // Don't toggle if it's start or end node
        if (node.isStart || node.isEnd) return;

        node.isWall = !node.isWall;
        node.element.classList.toggle('wall');
    }

    // Add mouse event listeners for grid interaction
    addMouseEventListeners() {
        // Mouse down event
        this.gridElement.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('node')) {
                this.isMousePressed = true;
                const node = e.target.node;
                
                // Determine action based on node type
                if (node.isStart) {
                    this.currentNodeType = 'start';
                } else if (node.isEnd) {
                    this.currentNodeType = 'end';
                } else {
                    this.currentNodeType = 'wall';
                    this.toggleWall(node);
                }
            }
        });

        // Mouse enter event (for dragging)
        this.gridElement.addEventListener('mouseenter', (e) => {
            if (this.isMousePressed && e.target.classList.contains('node')) {
                const node = e.target.node;
                
                // Handle different node types
                if (this.currentNodeType === 'start' && !node.isEnd) {
                    this.setStartNode(node.row, node.col);
                } else if (this.currentNodeType === 'end' && !node.isStart) {
                    this.setEndNode(node.row, node.col);
                } else if (this.currentNodeType === 'wall' && !node.isStart && !node.isEnd) {
                    this.toggleWall(node);
                }
            }
        }, true);

        // Mouse up event
        document.addEventListener('mouseup', () => {
            this.isMousePressed = false;
        });
    }

    // Clear the entire grid
    clearGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                
                // Reset node properties
                node.isWall = false;
                node.isVisited = false;
                node.distance = Infinity;
                node.previousNode = null;
                node.f = Infinity;
                node.g = Infinity;
                node.h = Infinity;
                
                // Reset node appearance
                node.element.className = 'node';
                if (node.isStart) node.element.classList.add('start');
                if (node.isEnd) node.element.classList.add('end');
            }
        }
    }

    // Clear only the path (visited nodes and path nodes)
    clearPath() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                
                // Reset path-related properties
                node.isVisited = false;
                node.distance = Infinity;
                node.previousNode = null;
                node.f = Infinity;
                node.g = Infinity;
                node.h = Infinity;
                
                // Reset path-related appearance
                node.element.classList.remove('visited');
                node.element.classList.remove('path');
            }
        }
    }

    // Generate a random maze using recursive division
    generateMaze() {
        // Clear the grid first
        this.clearGrid();
        
        // Add random walls
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                
                // Skip start and end nodes
                if (node.isStart || node.isEnd) continue;
                
                // 30% chance to create a wall
                if (Math.random() < 0.3) {
                    node.isWall = true;
                    node.element.classList.add('wall');
                }
            }
        }
    }

    // Get all neighbors of a node
    getNeighbors(node) {
        const neighbors = [];
        const {row, col} = node;
        
        // Check all four directions
        if (row > 0) neighbors.push(this.grid[row - 1][col]); // Up
        if (row < this.rows - 1) neighbors.push(this.grid[row + 1][col]); // Down
        if (col > 0) neighbors.push(this.grid[row][col - 1]); // Left
        if (col < this.cols - 1) neighbors.push(this.grid[row][col + 1]); // Right
        
        // Filter out walls
        return neighbors.filter(neighbor => !neighbor.isWall);
    }

    // Animate the visited nodes and the path
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed) {
        const animationSpeed = 101 - speed; // Convert speed to milliseconds (1-100 to 100-1)
        
        // Animate visited nodes
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isEnd) {
                    node.element.classList.add('visited');
                }
            }, i * animationSpeed);
        }

        // Animate shortest path after visited nodes animation is done
        setTimeout(() => {
            this.animatePath(nodesInShortestPathOrder, animationSpeed);
        }, visitedNodesInOrder.length * animationSpeed);
    }

    // Animate the shortest path
    animatePath(nodesInShortestPathOrder, animationSpeed) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (!node.isStart && !node.isEnd) {
                    node.element.classList.add('path');
                }
            }, i * animationSpeed * 2); // Path animation is slower for better visibility
        }
    }

    // Resize the grid based on screen size
    resizeGrid() {
        const width = window.innerWidth;
        let newRows = 20;
        let newCols = 25;
        
        if (width < 480) {
            newRows = 10;
            newCols = 10;
        } else if (width < 768) {
            newRows = 15;
            newCols = 15;
        } else if (width < 1200) {
            newRows = 15;
            newCols = 20;
        }
        
        if (newRows !== this.rows || newCols !== this.cols) {
            this.rows = newRows;
            this.cols = newCols;
            this.initializeGrid();
        }
    }
}

// Export the Grid class
window.Grid = Grid;