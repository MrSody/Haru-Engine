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
        defaultValue: '81',
    },
    keyAction2: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action2',
        defaultValue: '87',
    },
    keyAction3: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action3',
        defaultValue: '69',
    },
    keyAction4: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action4',
        defaultValue: '82',
    },
    keyAction5: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action5',
        defaultValue: '84',
    },
    keyAction6: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Action6',
        defaultValue: '65',
    },
    keyCharacter: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Character',
        defaultValue: '80',
    },
    keyBook: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Book',
        defaultValue: '76',
    },
    keyMenu: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Menu',
        defaultValue: '27',
    },
    keyMap: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Map',
        defaultValue: '77',
    },
    keySkills: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Skills',
        defaultValue: '74',
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