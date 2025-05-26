// Main JavaScript file for handling UI interactions and connecting components

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the grid
    const grid = new Grid();
    
    // Initialize the algorithms
    const algorithms = new Algorithms(grid);
    
    // Get UI elements
    const algorithmSelect = document.getElementById('algorithm');
    const clearGridBtn = document.getElementById('clear-grid');
    const clearPathBtn = document.getElementById('clear-path');
    const generateMazeBtn = document.getElementById('generate-maze');
    const startBtn = document.getElementById('start-btn');
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speed-value');
    const algorithmDescription = document.getElementById('algorithm-description');
    const nodesVisited = document.getElementById('nodes-visited');
    const pathLength = document.getElementById('path-length');
    const distanceTraveled = document.getElementById('distance-traveled');
    const darkModeToggle = document.getElementById('theme-toggle');
    const diagonalMovementToggle = document.getElementById('allow-diagonal');
    const weightedNodesToggle = document.getElementById('use-weights');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeTutorialBtn = document.getElementById('close-tutorial');
    const legendItems = document.querySelectorAll('.legend-item');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    
    // Set initial speed value
    speedValue.textContent = speedSlider.value;
    let isAnimating = false; // Track if animation is in progress
    
    // Event listener for algorithm selection
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    
    // Event listener for clear grid button
    clearGridBtn.addEventListener('click', () => {
        if (isAnimating) return; // Prevent action during animation
        grid.clearGrid();
        // Reset distance stats
        nodesVisited.textContent = '0';
        pathLength.textContent = '0';
        distanceTraveled.textContent = '0';
        // Hide progress bar
        if (progressContainer) progressContainer.style.display = 'none';
    });
    
    // Event listener for clear path button
    clearPathBtn.addEventListener('click', () => {
        if (isAnimating) return; // Prevent action during animation
        grid.clearPath();
        // Reset distance stats
        nodesVisited.textContent = '0';
        pathLength.textContent = '0';
        distanceTraveled.textContent = '0';
        // Hide progress bar
        if (progressContainer) progressContainer.style.display = 'none';
    });
    
    // Event listener for generate maze button
    generateMazeBtn.addEventListener('click', () => {
        if (isAnimating) return; // Prevent action during animation
        grid.generateMaze();
        // Reset distance stats
        nodesVisited.textContent = '0';
        pathLength.textContent = '0';
        distanceTraveled.textContent = '0';
    });
    
    // Event listener for speed slider
    speedSlider.addEventListener('input', () => {
        speedValue.textContent = speedSlider.value;
    });
    
    // Event listener for dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 
            document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
        localStorage.setItem('darkMode', document.documentElement.getAttribute('data-theme') === 'dark');
    });
    
    // Event listener for diagonal movement toggle
    diagonalMovementToggle.addEventListener('change', () => {
        grid.setDiagonalMovement(diagonalMovementToggle.checked);
    });
    
    // Event listener for weighted nodes toggle
    weightedNodesToggle.addEventListener('change', () => {
        grid.setWeightedNodes(weightedNodesToggle.checked);
    });
    
    // Event listener for tutorial button
    tutorialBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'flex';
    });
    
    // Event listener for close tutorial button
    closeTutorialBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
    });
    
    // Close tutorial modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    });
    
    // Event listener for start button
    startBtn.addEventListener('click', () => {
        if (isAnimating) return; // Prevent starting during animation
        
        // Set animating flag
        isAnimating = true;
        
        // Disable buttons during animation
        disableButtons(true);
        
        // Get the selected algorithm
        const selectedAlgorithm = algorithmSelect.value;
        
        // Clear any previous path
        grid.clearPath();
        
        // Run the algorithm
        const { visitedNodesInOrder, nodesInShortestPathOrder, distanceTraveled: distanceStats } = algorithms.runAlgorithm(
            selectedAlgorithm,
            grid.startNode,
            grid.endNode
        );
        
        // Update distance information
        nodesVisited.textContent = distanceStats.visited;
        pathLength.textContent = distanceStats.path;
        distanceTraveled.textContent = distanceStats.pathDistance;
        
        // Show progress container
        if (progressContainer) {
            progressContainer.style.display = 'block';
            if (progressBar) progressBar.style.width = '0%';
        }
        
        // Animate the algorithm
        grid.animateAlgorithm(
            visitedNodesInOrder,
            nodesInShortestPathOrder,
            parseInt(speedSlider.value)
        );
        
        // Calculate total animation time to re-enable buttons after animation
        const animationSpeed = 101 - parseInt(speedSlider.value);
        const totalAnimationTime = 
            visitedNodesInOrder.length * animationSpeed + 
            nodesInShortestPathOrder.length * animationSpeed * 2;
        
        // Re-enable buttons after animation
        setTimeout(() => {
            disableButtons(false);
            isAnimating = false; // Reset animating flag
        }, totalAnimationTime + 100); // Add small buffer
    });
    
    // Function to update algorithm information
    function updateAlgorithmInfo() {
        const selectedAlgorithm = algorithmSelect.value;
        let html = '';
        
        switch (selectedAlgorithm) {
            case 'dijkstra':
                html = `
                    <h3>Dijkstra's Algorithm</h3>
                    <p>Dijkstra's algorithm is a weighted algorithm that guarantees the shortest path. It works by visiting nodes in order of increasing distance from the start node.</p>
                    <p><strong>Time Complexity:</strong> O((V + E) log V) where V is the number of vertices and E is the number of edges.</p>
                    <p><strong>Space Complexity:</strong> O(V)</p>
                `;
                break;
            case 'astar':
                html = `
                    <h3>A* Search Algorithm</h3>
                    <p>A* is a weighted algorithm that uses heuristics to find the shortest path more efficiently than Dijkstra's algorithm. It combines Dijkstra's algorithm with a heuristic that estimates the distance to the end node.</p>
                    <p><strong>Time Complexity:</strong> O(E) in the worst case, but typically much faster due to heuristics.</p>
                    <p><strong>Space Complexity:</strong> O(V)</p>
                `;
                break;
            case 'bfs':
                html = `
                    <h3>Breadth-First Search</h3>
                    <p>BFS is an unweighted algorithm that guarantees the shortest path in an unweighted graph. It explores all neighbors at the present depth before moving on to nodes at the next depth level.</p>
                    <p><strong>Time Complexity:</strong> O(V + E) where V is the number of vertices and E is the number of edges.</p>
                    <p><strong>Space Complexity:</strong> O(V)</p>
                `;
                break;
            case 'dfs':
                html = `
                    <h3>Depth-First Search</h3>
                    <p>DFS is an unweighted algorithm that does not guarantee the shortest path. It explores as far as possible along each branch before backtracking.</p>
                    <p><strong>Time Complexity:</strong> O(V + E) where V is the number of vertices and E is the number of edges.</p>
                    <p><strong>Space Complexity:</strong> O(V)</p>
                `;
                break;
        }
        
        algorithmDescription.innerHTML = html;
    }
    
    // Function to disable/enable buttons during animation
    function disableButtons(disable) {
        clearGridBtn.disabled = disable;
        clearPathBtn.disabled = disable;
        generateMazeBtn.disabled = disable;
        startBtn.disabled = disable;
        algorithmSelect.disabled = disable;
        diagonalMovementToggle.disabled = disable;
        weightedNodesToggle.disabled = disable;
        
        // Add visual indication for disabled buttons
        const buttons = document.querySelectorAll('.controls button');
        buttons.forEach(button => {
            if (disable) {
                button.classList.add('disabled');
            } else {
                button.classList.remove('disabled');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        grid.resizeGrid();
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (isAnimating || e.target.matches('input, select, textarea')) return;
        
        switch (e.key.toLowerCase()) {
            case ' ': // Space to start algorithm
                e.preventDefault();
                startBtn.click();
                break;
            case 'c': // C to clear path
                clearPathBtn.click();
                break;
            case 'g': // G to clear grid
                clearGridBtn.click();
                break;
            case 'm': // M to generate maze
                generateMazeBtn.click();
                break;
            case 'd': // D to toggle dark mode
                darkModeToggle.click();
                break;
        }
    });
    
    // Initialize tooltips for legend items
    if (legendItems) {
        legendItems.forEach(item => {
            const nodeType = item.getAttribute('data-node-type');
            let description = '';
            
            switch (nodeType) {
                case 'start':
                    description = 'Start Node: The beginning point of the path';
                    break;
                case 'end':
                    description = 'End Node: The destination point of the path';
                    break;
                case 'wall':
                    description = 'Wall Node: Obstacles that cannot be traversed';
                    break;
                case 'weight':
                    description = 'Weighted Node: Costs more to traverse (5x normal cost)';
                    break;
                case 'visited':
                    description = 'Visited Node: Nodes that have been explored by the algorithm';
                    break;
                case 'path':
                    description = 'Path Node: The final shortest path from start to end';
                    break;
            }
            
            item.title = description;
        });
    }
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Show tutorial on first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
        tutorialModal.style.display = 'flex';
        localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    // Set initial algorithm info
    updateAlgorithmInfo();
});
