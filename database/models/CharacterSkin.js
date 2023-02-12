const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'CHARACTER_SKIN';
const NAME_MODEL = 'characterSkin';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    skinBase: {
        type: DataTypes.INTEGER,
        field: 'skin_base',
    },
    skinHair: {
        type: DataTypes.INTEGER,
        field: 'skin_hair',
    }
}

class CharacterSkin extends Model {
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: CharacterSkin }