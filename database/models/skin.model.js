const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'SKIN';
const NAME_MODEL = 'skin';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    base: {
        type: DataTypes.INTEGER,
        field: 'Base',
    },
    hair: {
        type: DataTypes.INTEGER,
        field: 'Hair',
    },
}

class skin extends Model {
    static associate(models) {
        this.hasOne(models.character, { as: 'CHARACTER', foreignKey: 'ID_Skin' });
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: skin }