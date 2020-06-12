export default class Interface {
    constructor () {
        this.maxPlayers = 5;
        this.maxLoadScreen = 4;

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
    Ayuda - HUB
*-------------------------------*/
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    documentSelect (element) {
        return document.querySelector(element);
    }

    removeClass (element, style) {
        let documentSelect = this.documentSelect(element);
        documentSelect.classList.remove(style);
    }

    addClass (element, style) {
        let documentSelect = this.documentSelect(element);
        documentSelect.classList.add(style);
    }

    removeOrAddByID (element, style) {
        let documentSelect = this.documentSelect(element);
        documentSelect.classList.toggle(style);
    }

    innerHTML (element, html) {
        let documentSelect = this.documentSelect(element);
        documentSelect.innerHTML = html;
    }

    focus (element) {
        let documentSelect = this.documentSelect(element);
        documentSelect.focus();
    }

    blur (element) {
        let documentSelect = this.documentSelect(element);
        documentSelect.blur();
    }

/*-------------------------------
    HUB - Pantalla de carga
*-------------------------------*/
    loadScreen (element, style) {
        
        if (element != null && style != null) {
            this.addClass(element, style);
        }

        let html = `<img src="../img/game/Wallpaper/${this.getRandomInt(1, this.maxLoadScreen)}.jpg" style="width: 100%">`;

        // Elimina la clase Invisible
        this.removeClass('#loading', 'Invisible');

        this.innerHTML('#loading', html);
    }

/*-------------------------------
    HUB - Pantalla de personajes
*-------------------------------*/
    accountCharacters (count) {
        let character = this.characters[count];

        let html =  `<div class="col">
                        <img src="../sprites/Player/Base/${character.skinBase}.png">
                    </div>
                    <div class="col">
                        <div>${character.name}</div>
                    </div>`;

        return html;
    }

    // Muestra los personajes en la interface
    onAccountCharacters (data) {
        // Ocualta la pantalla de carga
        this.addClass('#loading', 'Invisible');

        // Muestra la pantalla de los personajes
        this.removeClass('#character', 'Invisible');

        console.log(data);

        let html = "";

        this.selCharacter(data[0].ID, data[0].Skin_Base, data[0].Name);

        let count = 0;
        data.forEach((Pj) => {

            this.characters.push({ID: Pj.ID, skinBase: Pj.Skin_Base, name: Pj.Name});

            this.addClass(`#Pj_${count}`, 'bgCharacter');
            this.innerHTML(`#Pj_${count}`, this.accountCharacters(count));
            count++;
        });

        for (let count = data.length; count < this.maxPlayers; count++) {
            this.addClass(`#Pj_${count}`, 'bgNewCharacter');
        }
    }

    selCharacter (ID, Skin_Base, Name) {
        // Save ID pj active
        this.setIDPJ(ID);
        
        this.innerHTML('#characters_Skin', `<div id="characters_Skin" style="margin-top: 15%; margin-left: 40%;"><img src="../sprites/Player/Base/${Skin_Base}.png" style="width: 150px;"></div>`);
        this.innerHTML('#characters_Name', `Nombre: ${Name}`);
    }
}