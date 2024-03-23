import LocalPlayer from "../../modules/entities/player/localPlayer.js";
import InterfaceGame from "../../modules/hub/interface/interfaceGame.js";

export default  class Keyboard {
    /**
     * @constructor
     * @param {{
     *      keyAction1: number,
     *      keyAction2: number,
     *      keyAction3: number,
     *      keyAction4: number,
     *      keyAction5: number,
     *      keyAction6: number,
     *      keyCharacter: number,
     *      keyBook: number,
     *      keyMenu: number,
     *      keyMap: number,
     *      keySkills: number,
     *      keyRunning: number,
     *      keyEnter: number,
     *      }} playerKeyboard
     */
    constructor (playerKeyboard) {
        /**
         * @type {{ keyAction1: number; keyAction2: number; keyAction3: number; keyAction4: number; keyAction5: number; keyAction6: number; keyCharacter: number; keyBook: number; keyMenu: number; keyMap: number; keySkills: number; keyRunning: number; keyEnter: number; }}
         */
        this.keyBoard = playerKeyboard;
    }

    /**
     * @param {number} keyCode 
     * @param {LocalPlayer} localPlayer 
     */
    keyDown (keyCode, localPlayer) {
        if (keyCode === this.keyBoard["keyRunning"]) {
            localPlayer.goRun = true;
        }
    }

    /**
     * @param {number} keyCode
     * @param {LocalPlayer} localPlayer
     * @param {InterfaceGame} clsInteface
     */
    keyUp (keyCode, localPlayer, clsInterfaceGame) {
        switch (keyCode) {
            case this.keyBoard["keyEnter"]:
                clsInterfaceGame.focusChat();
                break;

            case this.keyBoard["keyRunning"]:
                localPlayer.goRun = false;
                break;

            // CODE OBSOLETE
            // case this.keyBoard["keyCharacter"]:
            //     let contenedorPersonaje_Active = document.querySelector('#draggable_contenedorPersonaje').classList.contains("invisible");
            
            //     if (contenedorPersonaje_Active) {
            //         document.querySelector('#draggable_contenedorPersonaje').classList.remove("invisible");
            //     } else {
            //         document.querySelector('#draggable_contenedorPersonaje').classList.add("invisible");
            //     }
            //     break;
        }
    }
}