import Interface from './interface.js';
import CursorTypesEnums from "../../enums/cursorTypes.js";

export default class InterfaceGame extends Interface {
    constructor () {
        super();


    }

/*-------------------------------
    HUB - GAME
*-------------------------------*/
    
    /**
     * @param {CursorTypesEnums.cursorTypes()} typeCursor
     */
    styleCursor (typeCursor) {
        document.documentElement.style.cursor = typeCursor;
    }

    chatIsActive () {
        return !!(!$('#hubPrincial').hasClass('Invisible') && $("#Mensaje").is(":focus"));
    }

    focusChat () {
        this.focus('#Mensaje');
    }

}