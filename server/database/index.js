const { Sequelize } = require('sequelize');
const { config } = require("../../config/config");
const setupModels = require('./setupModels');

// LOGs
const log4js = require('log4js');
const logger = log4js.getLogger('database');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

const URL = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URL, { dialect: "mysql" });

sequelize.options.logging = (message) => {
   logger.error(message);
};

setupModels(sequelize);

sequelize.sync();

sequelize.authenticate().then(() => {
   logger.info('Connection has been established successfully.');
}).catch((error) => {
   logger.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;