import Interface from './interface.js';

export default class interfaceCharacter extends Interface {
    constructor () {
        super();
        this.maxPlayers = 5;

        this.IDPJ;
        this.characters = [];
    }

    setIDPJ (id) {
        this.IDPJ = id;
    }

    getIDPJ () {
        return this.IDPJ;
    }

    getCharacters () {
        return this.characters;
    }

    /*-------------------------------
    HUB - Pantalla de personajes
    *-------------------------------*/
    accountCharacters (count) {
        let character = this.characters[count];

        let html =  `<div class="col">
                        <img src="../sprites/Player/Base/${character.SKIN.base}.png">
                    </div>
                    <div class="col">
                        <div>${character.name}</div>
                    </div>`;

        return html;
    }

    selCharacter (ID, Skin_Base, Name) {
        // Save ID pj active
        this.setIDPJ(ID);
        
        this.innerHTML('#characters_Skin', `<div id="characters_Skin" style="margin-top: 15%; margin-left: 40%;"><img src="../sprites/Player/Base/${Skin_Base}.png" style="width: 150px;"></div>`);
        this.innerHTML('#characters_Name', `Nombre: ${Name}`);
    }



    getDataCreateCharacter () {
        let genero = document.querySelector('input[name="genero"]:checked').value;
        let clase = document.querySelector('input[name="clase"]:checked').value;
        let inicio = document.querySelector('input[name="inicio"]:checked').value;
        let apariencia = document.querySelector('input[name="apariencia"]:checked').value;
        let cabello = document.querySelector('input[name="cabello"]:checked').value;
        let name = document.querySelector('input[name="name"]').value;
        let idAccount = document.querySelector('#ID').value;

        return { idAccount, genero, clase, inicio, apariencia, cabello, name }; 
    }





    // Muestra los personajes en la interface
    characterList (data) {
        // Ocualta la pantalla de carga
        this.addClass('#loading', 'Invisible');

        // Muestra la pantalla de los personajes
        this.removeClass('#character', 'Invisible');

        console.log(data);

        let html = "";

        this.selCharacter(data[0].id, data[0].SKIN.base, data[0].name);

        let count = 0;
        data.forEach((Pj) => {

            this.characters.push({ID: Pj.id, skinBase: Pj.SKIN.base, name: Pj.name});

            this.addClass(`#Pj_${count}`, 'bgCharacter');
            this.innerHTML(`#Pj_${count}`, this.accountCharacters(count));
            count++;
        });

        for (let count = data.length; count < this.maxPlayers; count++) {
            this.addClass(`#Pj_${count}`, 'bgNewCharacter');
        }
    }

    createCharacter () {
        // Ocualta la pantalla de carga
        this.addClass('#loading', 'Invisible');

        this.removeClass('#createCharacter', 'Invisible');

        console.log("Crear personaje");
    }
}