const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'CHARACTER';
const NAME_MODEL = 'character';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    idAccount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Account',
    },
    idCharacterSkin: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Character_Skin',
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
    },
    level: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Level',
    },
    experience: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Experience',
    },
    money: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Money',
    },
    idMap: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_MAP',
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
}

class Character extends Model {
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: Character }