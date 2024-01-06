const { models } = require('../../../database');

// LOGs
const log4js = require('log4js');
const logger = log4js.getLogger('database');

async function getCharactersSearchAccount(idAccount) {
    try {
        let characters = await models.character.findAll({
                            include: [
                                {
                                    association: 'SKIN',
                                    attributes: ['base', 'hair'],
                                },
                            ],
                            attributes: ['id', 'name' ],
                            where: {
                                idAccount: idAccount,
                                deleteDate: null,
                            },
                        });

        return characters;

    } catch(e) {
        logger.error('Error:', {file: 'characterController.js', method:'getCharacterSearchAccount', message: e});
        return null;
    }
}

async function createCharacter(data, skin, location, setting, attributes, keyboard) {
    try {
        let character = await models.character.create({
                            idAccount: data.idAccount,
                            idSkin: skin.id,
                            idLocation: location.id,
                            idAttributes: attributes.id,
                            idSetting: setting.id,
                            idKeyboard: keyboard.id,
                            name: data.name,
                            gender: data.gender,
                        });

        return getCharacterByIdCharacter(character.id);

    } catch(e) {
        logger.error('Error:', {file: 'characterController.js', method:'createCharacter', message: e});
        return null;
    }
}

async function getCharacterByIdCharacter(idCharacter) {
    try {
        let character = await models.character.findOne({
                            include: [
                                {
                                    association: 'SKIN',
                                    attributes: ['base', 'hair'],
                                },
                                {
                                    association: 'LOCATION',
                                    attributes: ['idMap', 'posX', 'posY'],
                                },
                                {
                                    association: 'ATTRIBUTES',
                                    attributes: ['strength'],
                                },
                                {
                                    association: 'KEYBOARD',
                                    attributes: ['keyAction1', 'keyAction2', 'keyAction3', 'keyAction4', 'keyAction5', 'keyAction6', 'keyCharacter', 'keyBook', 'keyMenu', 'keyMap', 'keySkills', 'keyRunning', 'keyEnter' ],
                                },
                            ],
                            attributes: ['id', 'name', 'gender', 'health', 'level', 'experience', 'money' ],
                            where: {
                                id: idCharacter,
                                deleteDate: null,
                            },
                        });

        await character.update({ online: 1 });

        return character;

    } catch(e) {
        logger.error('Error:', {file: 'characterController.js', method:'getCharacterByIdCharacter', message: e});
        return null;
    }
}

module.exports = { getCharactersSearchAccount, createCharacter, getCharacterByIdCharacter }