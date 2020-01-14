/*
Formato:[
    Sello1, Sello2, Sello3, Sello4, Sello5,
    Nombre [0=Original, 1=Español, 2=Ingles],
    Sprite
    Efecto [0=Buff, 1=DeBuff, 2=Teletrasporte, 3=Invocacion, 4=InvocacionCambio, 5=Area, 6=Disparo],
    Tipo [0=nada, 1=Fisico, 2=Cura ],
    Base,
    BaseSeg,
    tiempo
]

Q = 1
W = 2
E = 3
R = 4
T = 5

A = 6
S = 7
D = 8
F = 9
G = 0

class MyClass {
  constructor(...) {
    // ...
  }
  method1(...) {}
  method2(...) {}
  get something(...) {}
  set something(...) {}
  static staticMethod(..) {}
  // ...
}
*/

class Jutsu {
    constructor(ID, data) {
        this.ID = ID;
        this.name = [];
        this.seals = {Sello_1: data.Sello_1, Sello_2: data.Sello_2, Sello_3: data.Sello_3, Sello_4: data.Sello_4, Sello_5: data.Sello_5};
        this.sprite = data.Sprite;
        this.effect = data.Efecto;
        this.type = data.Tipo;
        this.base = data.Base;
        this.baseSeg = data.BaseSeg;
        this.time = data.Tiempo;
    }

/* ------------------------------ *
    FUNCIONES
* ------------------------------ */

    maxBuff(playerAttribute) {
        var min = 0,
            seg = 0,
            maxTime = Math.round( this.time + (playerAttribute.perception * 20));

        while(maxTime > 0) {
            if((maxTime - 60) >= 0) {
                maxTime -= 60;
                min += 1;
            } else {
                seg += maxTime;
                maxTime -= maxTime;
            }
        }
        return {min: min, seg: seg};
    }

    posJutsu(pos, posSizeScreen) {
        var x, y,
            posScreenX = Math.round((posSizeScreen.width / 2) / 32),
            posScreenY = Math.round((posSizeScreen.height / 2) / 32);

        x = (pos.x - posScreenX);
        y = (pos.y - posScreenY);

        return {x: x, y: y};
    }

    buffDefendingChange(playerAttribute) {
        return this.maxBuff(playerAttribute);
    }

    teleport(pos, posSizeScreen) {
        var x, y,
            posScreenX = Math.round((posSizeScreen.width / 2) / 32),
            posScreenY = Math.round((posSizeScreen.height / 2) / 32);

        x = (pos.x - posScreenX);
        y = (pos.y - posScreenY);

        return {x: x, y: y};
    }

    clonClick (pos, posSizeScreen, health, invocations) {
        let x, y,
            maxHealth = Math.round(health / 2),
            hurt = Math.round(150 / invocations.length),
            posScreenX = Math.round((posSizeScreen.width / 2) / 32),
            posScreenY = Math.round((posSizeScreen.height / 2) / 32);

        x = (pos.x - posScreenX);
        y = (pos.y - posScreenY);

        return {mode: 0, health: maxHealth, hurt: hurt, x: x, y: y};
    }

    effectBuff(jutsu, player) {
        switch(parseInt(this.type)) {
            case 0:
                var time = this.buffDefendingChange(player.getAttribute());

                console.log("time:"+ time.min +"-"+ time.seg);
                return {time: time};
            case 1:
                //clsJutsus.getBuffCure(jutsu.IDJutsu, player);
                break;
        }
    }

    effectTeleport(jutsu, player) {
        switch(parseInt(this.type)) {
            case 0:
                return this.teleport(jutsu.pos, player.getSizeScreen());
        }
    }

    effectInvocation (jutsu, player) {
        switch (parseInt(this.type)) {
            case 0:
                return this.clonClick(jutsu.pos, player.getSizeScreen(), player.getHealth().max, player.getInvocation());
        }
    }

    getJutsu(jutsu, player) {
        switch(this.effect) {
            case 0:
                //return maxBuff(jutsu, player);
                break;
            case 1:
                break;
            case 2:
                return teleport(jutsu.pos, player.getSizeScreen());
        }
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */

    get getID() {
        return this.ID;
    }

    get getName() {
        return this.name;
    }

    get getSeals() {
        return this.seals;
    }

    get getEffect () {
        return this.effect
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */

    set setNombre(nombre) {
        for(var q = 0; q < nombre.length; q++) {
            this.name.push(nombre[q]);
        }
    }

}

// Export the Player class so you can use it in other files by using require("Player").Player
exports.Jutsu = Jutsu;
