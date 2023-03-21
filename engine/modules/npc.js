/*
DATA OF NPC
- Rection [
    0 = Neutral => Si se ataca, pasa a ser agresivo
    1 = Amistoso => no se puede atacar
    2 = Agresivo => Ataca al ver cualquier pj
    3 = Guardia => Ataca al ver a otro pj con reaccion agresivo
]
*/

class Npc {
    constructor (data, Skin) {
        this.id = data.id;
        this.name = data.name;
        this.health = {now: data.health, max: data.health};
        this.skin = Skin;
        this.IDMap = data.idMap;
        this.posWorld = {x: data.posWorldX, y: data.posWorldY};
        
        this.visionDistance = data.visionDistance;
        this.reaction = data.reaction;
        
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
    
    getDir () {
        return this.dir;
    }
    
    isMoving () {
		return this.moving;
	}

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    setPosWorld (x, y) {
        this.posWorld.x += x;
        this.posWorld.y += y;
    }
    
    setDirection (dir) {
        this.dir = dir;
    }

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
}

exports.Npc = Npc;