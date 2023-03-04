const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'ATTRIBUTES';
const NAME_MODEL = 'attributes';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    strength: {
        type: DataTypes.INTEGER,
        field: 'Strength',
    },
}

class attributes extends Model {
    static associate(models) {
        this.hasOne(models.character, { as: 'CHARACTER', foreignKey: 'ID_Attributes' });
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: attributes }