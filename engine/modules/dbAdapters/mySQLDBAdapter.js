const mysql = require('mysql');
const { config } = require("../../../config/config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

const dataConnection = {
    host     : `${config.dbHost}`,
    user     : `${USER}`,
    password : `${PASSWORD}`,
    database : `${config.dbName}`
}

const getConnection = function () {
    return mysql.createConnection(dataConnection);
}

module.exports = getConnection;