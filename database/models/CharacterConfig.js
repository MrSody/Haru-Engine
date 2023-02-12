const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'CHARACTER_CONFIG';
const NAME_MODEL = 'characterConfig';

const schema = {
    idCharacter: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Character',
    },
    healPlayer: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Heal_Player',
    },
    namePlayer: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Name_Player',
    },
    healPlayers: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Heal_Player',
    },
    namePlayers: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Name_Players',
    },
    healNPC: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Heal_NPC',
    },
    nameNPC: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Name_NPC',
    },
}

class CharacterConfig extends Model {
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: CharacterConfig }