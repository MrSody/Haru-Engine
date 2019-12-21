class Jutsus {
    constructor () {
        this.jutsusUp = [];
        this.jutsusDown = [];
    }
    
/* ------------------------------ *
    FUNCIONES
* ------------------------------ */

    convertToVector (list) {
        var vector = [];

        for(var q = 0; q < list.length; q++) {
            vector.push(list[q]);
        }

        return vector;
    }

    // Actualiza la posicion
    posNowJutsu (widthMap, heightMap, posWorld, jutsu, count = 0) {
        //list.push(data.efecto, data.posNow, data.posLast, duracion);
        let posIntX = Math.floor(posWorld.x - widthMap),
            posIntY = Math.floor(posWorld.y - heightMap),
            posEndX = Math.floor(posWorld.x + widthMap),
            posEndY = Math.floor(posWorld.y + heightMap),
            posJutsu;

        if (count) {
            posJutsu = jutsu[count];
        } else {
            posJutsu = jutsu[1];
        }

        if ((posIntX >= posJutsu.x || posJutsu.x <= posEndX) && (posIntY >= posJutsu.y || posJutsu.y <= posEndY)) {
            for(let y = 0, intY = posIntY; intY <= posEndY; intY++, y++) {
                for(let x = 0, intX = posIntX; intX <= posEndX; intX++, x++) {

                    if (posJutsu.x == intX && posJutsu.y == intY) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        return false;
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */

    getJutsusUp () {
        return this.jutsusUp;
    }

    getJutsusDown () {
        return this.jutsusDown;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */

    setJutsusUp (list) {
        this.jutsusUp.push(this.convertToVector(list));
    }

    setJutsusDown(list) {
        this.jutsusDown.push(this.convertToVector(list));
    }

/* ------------------------------ *
    DRAW
* ------------------------------ */
    draw (ctx, cXnull, cYnull, jutsu, count) {
        const tileSize = 32;
        cXnull *= tileSize;
        cYnull *= tileSize;

        switch(parseInt(jutsu[0])) {
            case 2: // Teletrasportarse
                //data.efecto, posPlayer, data.posNow, data.posLast, 15
                console.log("Entro"+ cXnull +"--"+ cYnull);
                ctx.fillStyle = "#001dff";

                // Posicion nueva
                ctx.fillRect((cXnull - 32), (cYnull - 32), 64, 64);

                //ctx.drawImage(this.playersprite, this.frame*42, this.dir*43, 42, 43, cXnull, cYnull, 32, 32);

                // Posicion Antigua
                //ctx.fillRect((cXnull - (posLast.x * 32)), (cYnull - (posLast.y * 32)), 32, 32);

                //ctx.drawImage(this.playersprite, this.frame*42, this.dir*43, 42, 43, (cXnull - (posLast.x * 32)), (cYnull - (posLast.y * 32)), 32, 32);
                break;

        }

        if(jutsu[3] != 0) {
            this.jutsusDown[count][3] -= 1;
        } else {
            this.jutsusDown.splice(count, 1);
        }
    }

}
