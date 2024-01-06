export default class CursorTypesEnums {
    static cursorTypes () {
        return Object.freeze({
                    Walking: "url('../game/img/icons/mouse_walk.png') 16 16, auto",
                    NOWalking: "url('../game/img/icons/mouse_noWalk.png') 16 16, auto",
                    TalkToNPC: "url('../game/img/icons/mouse_talk.png') 16 16, auto",
                    AttackEnemy: "url('../game/img/icons/mouse_attack.png') 16 16, auto",
                });
    }
}