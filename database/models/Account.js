const { Model, DataTypes, Sequelize } = require('sequelize');

const NAME_TABLE = 'ACCOUNT';
const NAME_MODEL = 'account';

const schema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'ID',
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Email',
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Password',
    },
    createDate: {
      allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'Create_Date',
    }
}

class Account extends Model {
    static associate(models) {
        this.hasMany(models.character, { as: 'characters', foreignKey: 'idAccount'});
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: Account }