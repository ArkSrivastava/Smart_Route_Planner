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
    
    // Set initial speed value
    speedValue.textContent = speedSlider.value;
    
    // Event listener for algorithm selection
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    
    // Event listener for clear grid button
    clearGridBtn.addEventListener('click', () => {
        grid.clearGrid();
        // Reset distance stats
        nodesVisited.textContent = '0';
        pathLength.textContent = '0';
        distanceTraveled.textContent = '0';
    });
    
    // Event listener for clear path button
    clearPathBtn.addEventListener('click', () => {
        grid.clearPath();
        // Reset distance stats
        nodesVisited.textContent = '0';
        pathLength.textContent = '0';
        distanceTraveled.textContent = '0';
    });
    
    // Event listener for generate maze button
    generateMazeBtn.addEventListener('click', () => {
        grid.generateMaze();
    });
    
    // Event listener for speed slider
    speedSlider.addEventListener('input', () => {
        speedValue.textContent = speedSlider.value;
    });
    
    // Event listener for start button
    startBtn.addEventListener('click', () => {
        // Disable buttons during animation
        disableButtons(true);
        
        // Get the selected algorithm
        const selectedAlgorithm = algorithmSelect.value;
        
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
        }, totalAnimationTime);
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
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        grid.resizeGrid();
    });
    
    // Set initial algorithm info
    updateAlgorithmInfo();
});
