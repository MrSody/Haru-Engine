require('dotenv').config();
const bcrypt = require('bcrypt');

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser:  process.env.DB_USER,
  dbPassword:  process.env.DB_PASSWORD,
  dbHost:  process.env.DB_HOST,
  dbName:  process.env.DB_NAME,
  dbPort:  process.env.DB_PORT,
  saltPassword: bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS)),
}

module.exports = { config };