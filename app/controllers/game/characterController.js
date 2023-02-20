const { models } = require('../../../database');

async function getCharacterSearchAccount(idAccount) {
    try {
        let characters = await models.character.findAll({
                            attributes: [
                                'ID', 'Name', 'Skin_Base', 'Skin_Hair' 
                            ],
                            where: {
                                idAccount: idAccount
                            }
                        });

        return characters;

    } catch(e) {
        console.log(`Error: characterController - getCharacterSearchAccount: ${e}`);
        return null;
    }
}

module.exports = { getCharacterSearchAccount }