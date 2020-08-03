class Pathfinder {
    constructor(world, pathStart, pathEnd) {
        this.world = world;
        this.pathStart = pathStart;
        this.pathEnd = pathEnd;
        // the world data are integers:
        // anything higher than this number is considered blocked
        // this is handy is you use numbered sprites, more than one
        // of which is walkable road, grass, mud, etc
        this.maxWalkableTileNum = 0;
        
        // keep track of the world dimensions
        // Note that this A-star implementation expects the world array to be square:
        // it must have equal height and width. If your game world is rectangular,
        // just fill the array with dummy values to pad the empty space.
        this.worldWidth = this.world[0].length;
        this.worldHeight = this.world.length;
        this.worldSize = this.worldWidth * this.worldHeight;

        // which heuristic should we use?
        // default: no diagonals (Manhattan)
        //var distanceFunction = ManhattanDistance;
        //var findNeighbours = function(){}; // empty

        // alternate heuristics, depending on your game:

        // diagonals allowed but no sqeezing through cracks:
        ////this.distanceFunction = this.DiagonalDistance();
        ////this.findNeighbours = this.DiagonalNeighbours();

        // diagonals and squeezing through cracks allowed:
        /*var distanceFunction = DiagonalDistance;
        var findNeighbours = DiagonalNeighboursFree;

        // euclidean but no squeezing through cracks:
        var distanceFunction = EuclideanDistance;
        var findNeighbours = DiagonalNeighbours;

        // euclidean and squeezing through cracks allowed:
        var distanceFunction = EuclideanDistance;
        var findNeighbours = DiagonalNeighboursFree;
        */
    }

    move () {
        let start = this.pathStart,
            end = this.pathEnd,
            world = this.world,
            subLine = end.x - start.x,
            line = end.y - start.y,
            newPosX = 0, newPosY = 0;
  
        if (line > 0) {
            newPosY = 1;
        } else if (line == 0) {
            newPosY = 0;
        } else if (line < 0) {
            newPosY = -1;
        }

        if (subLine > 0) {
            newPosX = 1;
        } else if (subLine == 0) {
            newPosX = 0;
        } else if (subLine < 0) {
            newPosX = -1;
        }

        //return {x: Math.round(end.x - newPosX), y: Math.round(end.y - newPosY)}
        this.pathEnd.x = Math.round(end.x - newPosX);
        this.pathEnd.y = Math.round(end.y - newPosY);
        console.log("Mover: "+ this.pathEnd.x +"-"+ this.pathEnd.y);
        return this.calculatePath();
    }
    
    attack () {
        let start = this.pathStart,
            end = this.pathEnd,
            world = this.world,
            subLine = end.x - start.x,
            line = end.y - start.y,
            newPosX = 0, newPosY = 0;
        
        console.log(start.x +"-"+ start.y +"---"+ end.x +"-"+ end.y);
        
        if (line > 0 || line < 0 && subLine > 0 || subLine < 0) {
            subLine = 0;
        }        
  
        if (line > 0) {
            newPosY = 1;
        } else if (line == 0) {
            newPosY = 0;
        } else if (line < 0) {
            newPosY = -1;
        }

        if (subLine > 0) {
            newPosX = 1;
        } else if (subLine == 0) {
            newPosX = 0;
        } else if (subLine < 0) {
            newPosX = -1;
        }
        
        //return {x: Math.round(end.x - newPosX), y: Math.round(end.y - newPosY)}
        this.pathEnd.x = Math.round(end.x - newPosX);
        this.pathEnd.y = Math.round(end.y - newPosY);
        console.log("Mover: "+ this.pathEnd.x +" - "+ this.pathEnd.y);
        return this.calculatePath();
    }
    
    // distanceFunction functions
	DiagonalDistance (Point, Goal) {	// diagonal movement - assumes diag dist is 1, same as cardinals
		return Math.max(Math.abs(Point.x - Goal.x), Math.abs(Point.y - Goal.y));
	}

	// Neighbours functions, used by findNeighbours function
	// to locate adjacent available cells that aren't blocked

	// Returns every available North, South, East or West
	// cell that is empty. No diagonals,
	// unless distanceFunction function is not Manhattan
	Neighbours (x, y) {
		var	N = y - 1,
            S = y + 1,
            E = x + 1,
            W = x - 1,
            myN = N > -1 && this.canWalkHere(x, N),
            myS = S < this.worldHeight && this.canWalkHere(x, S),
            myE = E < this.worldWidth && this.canWalkHere(E, y),
            myW = W > -1 && this.canWalkHere(W, y),
            result = [];
        //console.log("myN:"+ myN +"myS"+ myS +" myE "+ myE +" myW "+ myW +"X"+ x +"Y"+ y);
		if (myN) {
            result.push({x:x, y:N});
        }
		if (myE) {
            result.push({x:E, y:y});
        }
		if (myS) {
            result.push({x:x, y:S});
        }
		if (myW) {
            result.push({x:W, y:y});
        }
		//findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
        return result;
	}

	// returns every available North East, South East,
	// South West or North West cell - no squeezing through
	// "cracks" between two diagonals
	DiagonalNeighbours (myN, myS, myE, myW, N, S, E, W, result) {
		if (myN) {
			if (myE && canWalkHere(E, N))
                result.push({x:E, y:N});
			if (myW && canWalkHere(W, N))
                result.push({x:W, y:N});
		}
		if (myS) {
			if (myE && canWalkHere(E, S))
                result.push({x:E, y:S});
			if (myW && canWalkHere(W, S))
                result.push({x:W, y:S});
		}
	}

	// returns every available North East, South East,
	// South West or North West cell including the times that
	// you would be squeezing through a "crack"
	DiagonalNeighboursFree (myN, myS, myE, myW, N, S, E, W, result) {
		myN = N > -1;
		myS = S < worldHeight;
		myE = E < worldWidth;
		myW = W > -1;
		if (myE) {
			if (myN && canWalkHere(E, N))
                result.push({x:E, y:N});
			if (myS && canWalkHere(E, S))
                result.push({x:E, y:S});
		}
		if (myW) {
			if (myN && canWalkHere(W, N))
                result.push({x:W, y:N});
			if(myS && canWalkHere(W, S))
                result.push({x:W, y:S});
		}
	}

	// returns boolean value (world cell is available and open)
	canWalkHere (x, y) {
        //var x = Math.floor(X);
        //var y = Math.floor(Y);
		// Returns true if cell is walkable or not walkable but an enemy
		//return ((world[x] != null) && (world[x][y] != null) && ((world[x][y] <= maxWalkableTileNum) || (x == pathEnd.x && y == pathEnd.y && (world[x][y] == 1 || world[x][y] == 2))));
		return ((this.world[y] != null) && (this.world[y][x] != null) && ((this.world[y][x] <= this.maxWalkableTileNum) || (x == this.pathEnd.x && y == this.pathEnd.y && (this.world[y][x] == 1 || this.world[y][x] == 2))));
		/*return ((world[x] != null) && (world[x][y] != null) && (world[x][y] <= maxWalkableTileNum));*/
	}

	// Node function, returns a new object with Node properties
	// Used in the calculatePath function to store route costs, etc.
	Node (Parent, Point) {
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the world linear array
			value:Point.x + (Point.y * this.worldWidth),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the heuristic estimated cost
			// of an entire path using this node
			f:0,
			// the distanceFunction cost to get
			// from the starting point to this node
			g:0
		};
		return newNode;
	}

	// Path function, executes AStar algorithm operations
	calculatePath () {
		// create Nodes from the Start and End x,y coordinates
		var	mypathStart = this.Node(null, this.pathStart);
		var mypathEnd = this.Node(null, this.pathEnd);
		// create an array that will contain all world cells
		var AStar = new Array(this.worldSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while (length = Open.length) {
			max = this.worldSize;
			min = -1;
			for (i = 0; i < length; i++) {
				if (Open[i].f < max) {
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if (myNode.value === mypathEnd.value) {
				myPath = Closed[Closed.push(myNode) - 1];
				do {
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			} else { // not the destination
				// find which nearby nodes are walkable
				myNeighbours = this.Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for (i = 0, j = myNeighbours.length; i < j; i++) {
					myPath = this.Node(myNode, myNeighbours[i]);

					if (!AStar[myPath.value]) {
						// estimated cost of this particular route so far
						myPath.g = myNode.g + this.DiagonalDistance(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + this.DiagonalDistance(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				Closed.push(myNode);
			}
		} // keep iterating until the Open list is empty

		let path = [[]];
		// create emptiness
		for (var x=0; x < result.length; x++) {
			path[x] = [];

			for (var y=0; y < result[0].length; y++) {
				path[x][y] = 0;
			}
		}

		for (var x=0; x < result.length; x++) {
			for (var y=0; y < result[0].length; y++) {
				path[x][y] = result[x][y];
			}
		}
		var moving = true;
        // actually calculate the a-star path!
        // this returns an array of coordinates
        // that is empty if no path is possible
		return result;
	}
}