const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'KEYBOARD';
const NAME_MODEL = 'keyboard';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    keyAction1: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action1',
    },
    keyAction2: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action2',
    },
    keyAction3: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action3',
    },
    keyAction4: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action4',
    },
    keyAction5: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action5',
    },
    keyAction6: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action6',
    },
    keyCharacter: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Character',
    },
    keyBook: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Book',
    },
    keyMenu: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Menu',
    },
    keyMap: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Map',
    },
    keySkills: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Skills',
    },
}

class keyboard extends Model {
    static associate(models) {
        this.hasOne(models.character, { as: 'CHARACTER', foreignKey: 'ID_Keyboard' });
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: keyboard }