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
        this.allowDiagonal = false; // Default to no diagonal movement
        this.useWeights = false; // Default to no weighted nodes
        this.keyPressed = null; // Track key presses for node type selection
        this.initializeGrid();
        this.addKeyboardListeners();
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
            isWeight: false,
            weight: 1, // Default weight is 1 (normal cost)
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
        
        // Add tooltip for better UX
        nodeElement.title = `Node at (${row}, ${col})`;

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

    // Toggle node type (wall or weight)
    toggleNodeType(node) {
        // Don't toggle if it's start or end node
        if (node.isStart || node.isEnd) return;
        
        // Handle different node types based on key pressed
        if (this.keyPressed === 'w' && this.useWeights) {
            // Toggle weight node
            if (node.isWall) {
                // Remove wall if exists
                node.isWall = false;
                node.element.classList.remove('wall');
            }
            
            // Toggle weight status
            node.isWeight = !node.isWeight;
            node.weight = node.isWeight ? 5 : 1; // Weight of 5 for weighted nodes
            node.element.classList.toggle('weight');
            node.element.title = node.isWeight ? `Weighted Node (Cost: ${node.weight})` : `Node at (${node.row}, ${node.col})`;
        } else {
            // Default to wall toggle
            if (node.isWeight) {
                // Remove weight if exists
                node.isWeight = false;
                node.weight = 1;
                node.element.classList.remove('weight');
            }
            
            // Toggle wall status
            node.isWall = !node.isWall;
            node.element.classList.toggle('wall');
            node.element.title = node.isWall ? 'Wall Node' : `Node at (${node.row}, ${node.col})`;
        }
    }

    // Add mouse event listeners for grid interaction
    addMouseEventListeners() {
        // Mouse down event
        this.gridElement.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('node')) {
                e.preventDefault(); // Prevent default drag behavior
                this.isMousePressed = true;
                const node = e.target.node;
                
                // Determine action based on node type
                if (node.isStart) {
                    this.currentNodeType = 'start';
                } else if (node.isEnd) {
                    this.currentNodeType = 'end';
                } else {
                    this.currentNodeType = 'wall';
                    this.toggleNodeType(node);
                }
            }
        });

        // Mouse enter event (for dragging)
        this.gridElement.addEventListener('mouseover', (e) => {
            if (this.isMousePressed && e.target.classList.contains('node')) {
                const node = e.target.node;
                
                // Handle different node types
                if (this.currentNodeType === 'start' && !node.isEnd) {
                    this.setStartNode(node.row, node.col);
                } else if (this.currentNodeType === 'end' && !node.isStart) {
                    this.setEndNode(node.row, node.col);
                } else if (this.currentNodeType === 'wall' && !node.isStart && !node.isEnd) {
                    this.toggleNodeType(node);
                }
            }
        });

        // Mouse up event
        document.addEventListener('mouseup', () => {
            this.isMousePressed = false;
            this.currentNodeType = 'wall'; // Reset to default
        });
        
        // Touch events for mobile support
        this.gridElement.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('node')) {
                e.preventDefault();
                this.isMousePressed = true;
                const node = e.target.node;
                
                if (node.isStart) {
                    this.currentNodeType = 'start';
                } else if (node.isEnd) {
                    this.currentNodeType = 'end';
                } else {
                    this.currentNodeType = 'wall';
                    this.toggleNodeType(node);
                }
            }
        }, { passive: false });
        
        this.gridElement.addEventListener('touchmove', (e) => {
            if (this.isMousePressed) {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                
                if (element && element.classList.contains('node')) {
                    const node = element.node;
                    
                    if (this.currentNodeType === 'start' && !node.isEnd) {
                        this.setStartNode(node.row, node.col);
                    } else if (this.currentNodeType === 'end' && !node.isStart) {
                        this.setEndNode(node.row, node.col);
                    } else if (this.currentNodeType === 'wall' && !node.isStart && !node.isEnd) {
                        this.toggleNodeType(node);
                    }
                }
            }
        }, { passive: false });
        
        this.gridElement.addEventListener('touchend', () => {
            this.isMousePressed = false;
            this.currentNodeType = 'wall';
        });
    }
    
    // Add keyboard listeners for node type selection
    addKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            this.keyPressed = e.key.toLowerCase();
        });
        
        document.addEventListener('keyup', () => {
            this.keyPressed = null;
        });
    }

    // Clear the entire grid
    clearGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                
                // Reset node properties
                node.isWall = false;
                node.isWeight = false;
                node.weight = 1;
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
                
                // Reset tooltip
                node.element.title = node.isStart ? 'Start Node' : 
                                    node.isEnd ? 'End Node' : 
                                    `Node at (${node.row}, ${node.col})`;
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
                
                // Update tooltip to reflect current state
                if (!node.isStart && !node.isEnd && !node.isWall && !node.isWeight) {
                    node.element.title = `Node at (${node.row}, ${node.col})`;
                }
            }
        }
        
        // Hide progress bar if visible
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    // Generate a random maze using recursive division
    generateMaze() {
        // Clear the grid first
        this.clearGrid();
        
        // Create border walls
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                
                // Skip start and end nodes
                if (node.isStart || node.isEnd) continue;
                
                // Create border walls
                if (row === 0 || col === 0 || row === this.rows - 1 || col === this.cols - 1) {
                    node.isWall = true;
                    node.element.classList.add('wall');
                    node.element.title = 'Wall Node';
                    continue;
                }
                
                // Add random walls and weights
                const random = Math.random();
                if (random < 0.25) { // 25% chance for wall
                    node.isWall = true;
                    node.element.classList.add('wall');
                    node.element.title = 'Wall Node';
                } else if (random < 0.35 && this.useWeights) { // 10% chance for weight if enabled
                    node.isWeight = true;
                    node.weight = 5;
                    node.element.classList.add('weight');
                    node.element.title = `Weighted Node (Cost: ${node.weight})`;
                }
            }
        }
        
        // Ensure path exists between start and end
        this.createMazePath(this.startNode, this.endNode);
    }
    
    // Create a guaranteed path between two nodes in the maze
    createMazePath(startNode, endNode) {
        let currentRow = startNode.row;
        let currentCol = startNode.col;
        const endRow = endNode.row;
        const endCol = endNode.col;
        
        // Create a path by moving from start to end
        while (currentRow !== endRow || currentCol !== endCol) {
            // Determine direction to move (horizontal or vertical)
            if (Math.random() < 0.5) {
                // Move horizontally if possible
                if (currentCol !== endCol) {
                    currentCol += currentCol < endCol ? 1 : -1;
                } else {
                    currentRow += currentRow < endRow ? 1 : -1;
                }
            } else {
                // Move vertically if possible
                if (currentRow !== endRow) {
                    currentRow += currentRow < endRow ? 1 : -1;
                } else {
                    currentCol += currentCol < endCol ? 1 : -1;
                }
            }
            
            // Clear the node to create a path
            const node = this.grid[currentRow][currentCol];
            if (!node.isStart && !node.isEnd) {
                node.isWall = false;
                node.isWeight = false;
                node.weight = 1;
                node.element.className = 'node';
                node.element.title = `Node at (${node.row}, ${node.col})`;
            }
        }
    }

    // Get all neighbors of a node
    getNeighbors(node) {
        const neighbors = [];
        const {row, col} = node;
        
        // Check all four directions (orthogonal)
        if (row > 0) neighbors.push(this.grid[row - 1][col]); // Up
        if (row < this.rows - 1) neighbors.push(this.grid[row + 1][col]); // Down
        if (col > 0) neighbors.push(this.grid[row][col - 1]); // Left
        if (col < this.cols - 1) neighbors.push(this.grid[row][col + 1]); // Right
        
        // Check diagonal directions if allowed
        if (this.allowDiagonal) {
            // Top-left
            if (row > 0 && col > 0) {
                // Only add diagonal if both adjacent orthogonal cells are not walls
                if (!this.grid[row - 1][col].isWall && !this.grid[row][col - 1].isWall) {
                    neighbors.push(this.grid[row - 1][col - 1]);
                }
            }
            // Top-right
            if (row > 0 && col < this.cols - 1) {
                if (!this.grid[row - 1][col].isWall && !this.grid[row][col + 1].isWall) {
                    neighbors.push(this.grid[row - 1][col + 1]);
                }
            }
            // Bottom-left
            if (row < this.rows - 1 && col > 0) {
                if (!this.grid[row + 1][col].isWall && !this.grid[row][col - 1].isWall) {
                    neighbors.push(this.grid[row + 1][col - 1]);
                }
            }
            // Bottom-right
            if (row < this.rows - 1 && col < this.cols - 1) {
                if (!this.grid[row + 1][col].isWall && !this.grid[row][col + 1].isWall) {
                    neighbors.push(this.grid[row + 1][col + 1]);
                }
            }
        }
        
        // Filter out walls
        return neighbors.filter(neighbor => !neighbor.isWall);
    }

    // Animate the visited nodes and the path
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed) {
        const animationSpeed = 101 - speed; // Convert speed to milliseconds (1-100 to 100-1)
        
        // Show and reset progress bar
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        if (progressContainer && progressBar) {
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
        }
        
        // Animate visited nodes
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isEnd) {
                    node.element.classList.add('visited');
                    node.element.title = 'Visited Node';
                }
                
                // Update progress bar for visited nodes animation
                if (progressBar) {
                    const progress = (i / visitedNodesInOrder.length) * 50; // First half of progress
                    progressBar.style.width = `${progress}%`;
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
        const progressBar = document.getElementById('progress-bar');
        
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (!node.isStart && !node.isEnd) {
                    node.element.classList.add('path');
                    node.element.title = 'Path Node';
                }
                
                // Update progress bar for path animation
                if (progressBar) {
                    const progress = 50 + (i / nodesInShortestPathOrder.length) * 50; // Second half of progress
                    progressBar.style.width = `${progress}%`;
                }
                
                // When animation is complete, update progress to 100%
                if (i === nodesInShortestPathOrder.length - 1 && progressBar) {
                    progressBar.style.width = '100%';
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
    
    // Set diagonal movement option
    setDiagonalMovement(allow) {
        this.allowDiagonal = allow;
    }
    
    // Set weighted nodes option
    setWeightedNodes(use) {
        this.useWeights = use;
    }
}

// Export the Grid class
window.Grid = Grid;
