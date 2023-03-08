const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'NPC';
const NAME_MODEL = 'npc';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Name',
    },
    health: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Health',
        defaultValue: '100',
    },
    skin: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Skin',
    },
    Level: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Level',
        defaultValue: '1',
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
    },
    visionDistance: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Vision_Distance',
        defaultValue: '2',
    },
    reaction: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Reaction',
    }
}

class Npc extends Model {
    static associate() {
        // associate
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: Npc }