const { Model, DataTypes, Sequelize } = require('sequelize');
//const { characterSkinNameTable } = require('./CharacterSkin').NAME_TABLE;

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
        references: {
            model: 'ACCOUNT',
            key: 'ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    idSkin: {
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Skin',
        references: {
          model: 'SKIN',
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    idLocation: {
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Location',
        references: {
          model: 'LOCATION',
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    idAttributes: {
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Attributes',
        references: {
          model: 'ATTRIBUTES',
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    idSetting: {
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Setting',
        references: {
          model: 'SETTING',
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    idKeyboard: {
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ID_Keyboard',
        references: {
          model: 'KEYBOARD',
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Name',
    },
    gender: {
        type: DataTypes.SMALLINT,
        field: 'Gender',
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
    online: {
        type: DataTypes.BOOLEAN,
        field: 'Online',
    },
    deleteDate: {
        type: DataTypes.DATE,
        field: 'Delete_Date',
    }
}

class character extends Model {
    static associate(models) {
        this.belongsTo(models.skin, {as: 'SKIN', foreignKey: 'ID_Skin'});
        this.belongsTo(models.location, {as: 'LOCATION', foreignKey: 'ID_Location'});
        this.belongsTo(models.attributes, {as: 'ATTRIBUTES', foreignKey: 'ID_Attributes'});
        this.belongsTo(models.setting, {as: 'SETTING', foreignKey: 'ID_Setting'});
        this.belongsTo(models.keyboard, {as: 'KEYBOARD', foreignKey: 'ID_Keyboard'});
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

module.exports = { NAME_TABLE, NAME_MODEL, schema, model: character }