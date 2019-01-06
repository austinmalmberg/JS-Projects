class BFS {
  constructor() { }

  /*
    Returns a dictionary of points where key = point.row and val = point.column


  */
  getShortestPath(matrix, start, end) {

    //  Breadth-first search

    let nodeDict = {};
    for(let row = 0; row < matrix.length; row++) {
      for(let col = 0; col < matrix[row].length; col++) {
        nodeDict[[row, col]] = new Node(row, col);
      }
    }

    start = getNode(start.x, start.y);

    // initialize queue
    let queue = [];
    queue.push(start);

    // initialize visited
    let visited = new Set();
    visited.add(start);

    while(queue.length > 0) {
      let current = queue.shift();
      neighbors(current).forEach(function(node) {
        if(!visited.has(node)) {
          queue.push(node);
          visited.add(node);
        }
      });
    }

    return Array.from(visited);



    // getShortestPath inner functions

    function neighbors(node) {
      let n = [
        getNode(node.x, node.y+1),
        getNode(node.x, node.y-1),
        getNode(node.x+1, node.y),
        getNode(node.x-1, node.y)
      ];

      return n.filter(node => node && !isWall(node));

      function isWall(node) {
        return matrix[node.x][node.y];
      }
    }

    function getNode(x, y) {
      return nodeDict[[x, y]];
    }
  }
}
