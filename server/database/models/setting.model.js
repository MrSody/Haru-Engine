const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'SETTING';
const NAME_MODEL = 'setting';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    healPlayer: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Heal_Player',
        defaultValue: '1',
    },
    namePlayer: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Name_Player',
        defaultValue: '1',
    },
    healNPC: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Heal_NPC',
        defaultValue: '1',
    },
    nameNPC: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Name_NPC',
        defaultValue: '1',
    },
}

class setting extends Model {
	static associate(models) {
    	this.hasOne(models.character, { as: 'CHARACTER', foreignKey: 'ID_Setting' });
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: setting }