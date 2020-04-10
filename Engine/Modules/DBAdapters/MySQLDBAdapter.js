const mysql = require('mysql');

const dataConnection = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'projectMMO'
}

const getConnection = function () {
    return mysql.createConnection(dataConnection);
}

module.exports = getConnection;
