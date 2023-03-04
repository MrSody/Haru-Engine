const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'LOCATION';
const NAME_MODEL = 'location';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    idMap: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Map',
    },
    posX: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Pos_X',
    },
    posY: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Pos_Y',
    }
}

class location extends Model {
    static associate(models) {
        this.hasOne(models.character, { as: 'CHARACTER', foreignKey: 'ID_Location' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: NAME_TABLE,
            modelName: NAME_MODEL,
            timestamps: false
        }
    }
}

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: location }