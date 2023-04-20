const { models } = require('../../../database');

// LOGs
const log4js = require('log4js');
const logger = log4js.getLogger('database');

async function createLocation(idAldea) {
    try {
        let idMap = '0',
            posX = 0,
            posY = 0;

        switch (idAldea) {
            case 1:
            case 2:
            case 3:
            case 4:
            default:
                posX = 64;
                posY = 63;
                break;
        }

        let location = await models.location.create({
                            idMap: idMap,
                            posX: posX,
                            posY: posY,
                        });

        return location;

    } catch(e) {
        logger.error('Error:', {file: 'locationController.js', method:'createLocation', message: e});
        return null;
    }
}

module.exports = { createLocation }