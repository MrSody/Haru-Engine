class Interface {
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    loadScreen () {

        let html = `<img src="../img/game/Wallpaper/${this.getRandomInt(1, 4)}.jpg" style="width: 100%">`;

        $('#loading').removeClass('Invisible');

        $('#loading').append( html );
    }

    accountCharacters (data) {
        let [id, skinBase, nombre, fuerza, agilidad, inteligencia, sellos, resistencia, vitalidad, destreza, percepcion] = data;

        let html =  `<div id="Pj_${id}" class="row personaje" onclick="selCharacter(${id},'${skinBase}','${nombre}',${fuerza},${agilidad},${inteligencia},${sellos},${resistencia},${vitalidad},${destreza},${percepcion})">
                        <div class="col">
                            <img src="../sprites/Player/Base/${skinBase}.png">
                        </div>
                        <div class="col">
                            <div>${nombre}</div>
                            <div>Rango</div>
                        </div>
                    </div>`;

        return html;
    }

    accountNewCharacter (count, id){

        let html =  `<div id="Pj_${count}" class="row" onclick="createCharacter(${id})">`+
                        '<div class="col">'+
                            '<div>Nuevo Pj</div>'+
                        '</div>'+
                    '</div>';

        return html;
    }

    changeCharacter (mode) {

        $("[id^=containerCharacter]").addClass('Invisible');

        switch (mode) {
            case 1:
                $('#containerCharacter_Character').removeClass('Invisible');
                break;
            case 2:
                $('#containerCharacter_Attribute').removeClass('Invisible');
                break;
            case 4:
                $('#containerCharacter_Jutsu').removeClass('Invisible');
                break;
            default:
                alert("Contenedor "+ mode);
        }
    }
}
