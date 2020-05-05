/*
// BASICO
- Nombre
- Salud
- Nivel
- Skin
- Posicion [X, Y]
- Reacción [
        0 = Neutral => Si se ataca, pasa a ser agresivo
        1 = Amistoso => no se puede atacar
        2 = Agresivo => Ataca al ver cualquier pj
        3 = Guardia => Ataca al ver a otro pj con reaccion agresivo
    ]
- Frases []
//
- Misiones_Empieza []
- Misiones_Termina []
- Eventos [
        0 = Ninguno =>
        1 = Guardia => Se pasea por una ruta definida
        2 = Vendedor => Le vende articulos al jugador
        3 = Mision => Le entrega misiones al jugador
        4 = Boss => Tiene eventos predefinidos para el combate
    ]
- Drop []
*/

class Npc {
    constructor (data, pos, Skin) {
        this.id = data.ID;
        this.name = data.Name;
        this.health = {now: data.Health, max: data.Health};
        this.skin = Skin;
        this.pos = {x: pos.X, y: pos.Y};
        this.reaction = data.Reaction;
        this.events = data.events;
        
        this.visionDistance = data.VisionDistance;

        /*
        this.move = false;
        this.phrases = data.phrases;
        this.missionsStart = data.missionsStart;
        this.missionsFinish = data.missionsFinish;
        this.drop = data.drop;
        */
        
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

    getPos () {
        return this.pos;
    }

    getReaction () {
        return this.reaction;
    }
    
    isAggressive () {
        return (this.reaction == "2" || this.reaction == "3") ? true : false;
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
    
    setPos (posX, posY) {
        this.pos.x += posX;
        this.pos.y += posY;
    }
    
    setDirection (dir) {
        this.dir = dir;
    }

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */
    
}

exports.Npc = Npc;