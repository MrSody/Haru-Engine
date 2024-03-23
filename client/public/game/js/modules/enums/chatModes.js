export default class ChatModesEnums {
    static ChatModes () {
        return Object.freeze({
                    Default: '',
                    Say: 's',
                    Whisper: 'w',
                    Position: 'pos',
                    Developer: 'dev',
                    Help: 'help',
                });
    }
}