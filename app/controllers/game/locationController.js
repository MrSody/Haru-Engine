const { models } = require('../../../database');

async function createLocation(idAldea) {
    try {
        let location = await models.location.create({
                            idMap: '0',
                            posX: 10,
                            posY: 10
                        });

        return location;

    } catch(e) {
        console.log(`Error: locationController - createLocation: ${e}`);
        return null;
    }
}

module.exports = { createLocation }