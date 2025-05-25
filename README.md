# Smart Route Planner

A web-based application for visualizing various pathfinding algorithms. This interactive tool helps users understand how different algorithms work to find paths between two points in a grid.

## Features

- **Multiple Pathfinding Algorithms**:
  - Dijkstra's Algorithm
  - A* Search
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)

- **Interactive Grid**:
  - Place start and end nodes
  - Create walls by clicking or dragging
  - Generate random mazes
  - Clear the grid or just the path

- **Visualization Controls**:
  - Adjust animation speed
  - Watch the algorithm exploration in real-time
  - See the final path highlighted

- **Educational Information**:
  - Learn about each algorithm's characteristics
  - Understand time and space complexity

- **Responsive Design**:
  - Works on desktop and mobile devices
  - Grid size adjusts based on screen size

## How to Use

1. **Select an Algorithm**: Choose from the dropdown menu
2. **Set Up the Grid**:
   - The start node (green) and end node (red) are placed by default
   - Click and drag to move them
   - Click or drag on empty cells to create walls (black)
3. **Optional**: Generate a random maze or clear the grid
4. **Adjust Speed**: Use the slider to control animation speed
5. **Start Visualization**: Click the "Start Visualization" button
6. **Watch the Algorithm**: Observe how the algorithm explores the grid
7. **View Results**: See the shortest path highlighted in yellow

## Algorithms Explained

### Dijkstra's Algorithm
A weighted algorithm that guarantees the shortest path. It works by visiting nodes in order of increasing distance from the start node.

### A* Search
A weighted algorithm that uses heuristics to find the shortest path more efficiently than Dijkstra's algorithm. It combines Dijkstra's algorithm with a heuristic that estimates the distance to the end node.

### Breadth-First Search (BFS)
An unweighted algorithm that guarantees the shortest path in an unweighted graph. It explores all neighbors at the present depth before moving on to nodes at the next depth level.

### Depth-First Search (DFS)
An unweighted algorithm that does not guarantee the shortest path. It explores as far as possible along each branch before backtracking.

## Technical Implementation

This project is built using:
- HTML5 for structure
- CSS3 for styling and animations
- Vanilla JavaScript for functionality

The code is organized into three main components:
- **Grid**: Handles the grid creation and node interactions
- **Algorithms**: Implements the different pathfinding algorithms
- **Main**: Connects the UI with the grid and algorithms

## Running the Project

Simply open the `index.html` file in a web browser to start using the application. No server or build process is required.

## Future Enhancements

- Additional algorithms (Greedy Best-First Search, Bidirectional Search)
- Weighted nodes to simulate terrain
- Save and load grid configurations
- Step-by-step execution mode
- Algorithm comparison mode

## License

This project is open source and available under the MIT License.
