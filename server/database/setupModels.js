const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

function setupModels(sequelize) {

    fs.readdirSync(__dirname +'/models/')
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const dataFile = require(path.join(__dirname +'/models/', file));
        dataFile.model.init(dataFile.schema, dataFile.model.config(sequelize));

        db[dataFile.NAME_MODEL] = dataFile;
    });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].model.associate) {
            db[modelName].model.associate(sequelize.models);
        }
    });
}

module.exports = setupModels;