export default  class Keyboard {
    constructor (player) {}

    keyDown (keyCode, localPlayer, clsInteface) {
        if (!$('#hubPrincial').hasClass('Invisible')) {
            //alert("tecla "+ keyCode);
    
            if (!$("#Mensaje").is(":focus")) {
                switch (keyCode) {
                    case 16: // Shift - Correr
                        localPlayer.goRun = true;
                        break;
                }
            }
        }
    }

    keyUp (keyCode, localPlayer, clsInteface) {
        if (!$('#hubPrincial').hasClass('Invisible')) {
            //alert("tecla "+ keyCode);
    
            if (!$("#Mensaje").is(":focus")) {
                switch (keyCode) {
                    case 13: // Enter - Activa el chat
                        clsInteface.focus('#Mensaje');
                        break;

                    case 16: // Shift - Deja de correr
                        localPlayer.goRun = false;
                        break;

                    case 80: // P - Personaje
                        let contenedorPersonaje_Active = document.querySelector('#draggable_contenedorPersonaje').classList.contains("invisible");
                    
                        if (contenedorPersonaje_Active) {
                            document.querySelector('#draggable_contenedorPersonaje').classList.remove("invisible");
                        } else {
                            document.querySelector('#draggable_contenedorPersonaje').classList.add("invisible");
                        }
                        break;
                }
            }
        }
    }
}