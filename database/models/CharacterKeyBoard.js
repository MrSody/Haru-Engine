const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'CHARACTER_KEYBOARD';
const NAME_MODEL = 'characterKeyBoard';

const schema = {
    idCharacter: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Character',
    },
    keyAction1: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action1',
    },
    keyAction2: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action2',
    },
    keyAction3: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action3',
    },
    keyAction4: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action4',
    },
    keyAction5: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action5',
    },
    keyAction6: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action6',
    },
    keyAction7: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action7',
    },
    keyAction8: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action8',
    },
    keyAction9: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action9',
    },
    keyAction0: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Key_Action0',
    }
}

class CharacterKeyBoard extends Model {
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: CharacterKeyBoard }