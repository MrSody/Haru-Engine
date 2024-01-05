import LocalPlayer from "../entities/player/localPlayer";
import ChatModesEnums from "../enums/chatModes";

export default class Chat {
    constructor () {
        this.textHelp = `Bienvenido al menu de ayuda. <br>- Usa /pos para saber tu ubicacion actual.`;
    }

    /**
     * @param {LocalPlayer} localPlayer
     * @param {string} text
     * @returns {({ sendServer: boolean; mode: ChatModesEnums.ChatModes(); text: string; chatTo: string | null; })}
     */
    message (localPlayer, text) {
        const commandPattern = /^\/([^\s]+)(?:\s+(.+))?$/;
        const match = RegExp(commandPattern).exec(text);

        if (match != null) {
            const [, command, argument] = match;

            if (command != null) {
                switch (command) {
                    case ChatModesEnums.ChatModes().Say:
                        return {
                            sendServer: true, 
                            mode: ChatModesEnums.ChatModes().Say, 
                            text: argument, 
                            chatTo: null,
                        };
    
                    case ChatModesEnums.ChatModes().Whisper:
                        return {
                            sendServer: true, 
                            mode: ChatModesEnums.ChatModes().Whisper, 
                            text: argument.substring(argument.indexOf(" ") + 1), 
                            chatTo: argument.substring(0, argument.indexOf(" ")),
                        };
    
                    case ChatModesEnums.ChatModes().Position:
                        return {
                            sendServer: false, 
                            mode: ChatModesEnums.ChatModes().Position, 
                            text: `Posicion actual: X: ${localPlayer.getPosWorld().x} - Y: ${localPlayer.getPosWorld().y}`, 
                            chatTo: null,
                        };
    
                    case ChatModesEnums.ChatModes().Developer:
                        return {
                            sendServer: false, 
                            mode: ChatModesEnums.ChatModes().Developer, 
                            text: 'modo developer', 
                            chatTo: null,
                        };
    
                    case ChatModesEnums.ChatModes().Help:
                    default:
                        return {
                            sendServer: false, 
                            mode: ChatModesEnums.ChatModes().Help, 
                            text: this.textHelp, 
                            chatTo: null,
                        };
                }
            }
        }

        return {sendServer: true, mode: ChatModesEnums.ChatModes().Default, text: text, chatTo: null};
    }
}