class Npc {
    constructor (data, posWorldX, posWorldY, Skin) {
        this.id = data.ID;
        this.name = data.Name;
        this.health = {now: data.Health, max: data.Health};
        this.skin = Skin;
        this.IDMap = data.ID_Map;
        this.posWorld = {x: posWorldX, y: posWorldY};
        
        this.visionDistance = data.Vision_Distance;
        
		this.dir = 2;
		this.frame = 0;
		this.finalDir;
		this.moving = false;
		this.movingDir;
		this.path = [[]];
        this.stepCount = 0;
        
        this.posAttack = {x: 0, y: 0};
        
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */

    getID () {
        return this.id;
    }
    
    getName () {
        return this.name;
    }

    getIDMap () {
        return this.IDMap;
    }

    getPosWorld () {
        return this.posWorld;
    }
    
    getVisionDistance () {
        return this.visionDistance;
    }
    
    getDir () {
        return this.dir;
    }
    
    isMoving () {
		return this.moving;
	}

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    
    setPosWorld (X, Y) {
        this.posWorld.x += X;
        this.posWorld.y += Y;
    }
    
    setDirection (dir) {
        this.dir = dir;
    }

/* ------------------------------ *
    FUNCIONES
* ------------------------------ */
    
}

exports.Npc = Npc;