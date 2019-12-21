class PathfinderInvocation {
    //constructor(world, pathStart, pathEnd) {
    constructor (pathStart, pathEnd) {
        //this.world = world;
        this.pathStart = pathStart;
        this.pathEnd = pathEnd;
    }

    moveInvocation () {
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

        return {x: Math.round(end.x - newPosX), y: Math.round(end.y - newPosY)}
    }
    
    attackInvocation () {
        let start = this.pathStart,
            end = this.pathEnd,
            world = this.world,
            subLine = end.x - start.x,
            line = end.y - start.y,
            newPosX = 0, newPosY = 0;

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

        return {x: Math.round(end.x - newPosX), y: Math.round(end.y - newPosY)}
    }
}