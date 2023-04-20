const Sequelize = require('sequelize');
const { models } = require('../../../database');
const bcrypt = require('bcrypt');
const { config } = require("../../../config/config");

// LOGs
const log4js = require('log4js');
const logger = log4js.getLogger('app');
const loggerPlayers = log4js.getLogger('players');

async function createAccount (res, email, password) {

    try {
        const result = await models.account.create({
            email: email,
            password: bcrypt.hashSync(password, config.saltPassword),
        });
    
        if (result != null) {
            loggerPlayers.info(`Create account: ${email}`);
        } else {
            throw new Error(`The account couldn't be created.`);
        }
    } catch(e) {
        console.log(e);
        logger.error('Error:', {file: 'accountController.js', method:'createAccount', message: e});
    }
}

async function getAccountByEmailAndPassword (res, email, password) {
    try {
        let result = await models.account.findOne({ 
            where: {
                email: email,
            },
        });

        if (result != null && bcrypt.compareSync(password, result['dataValues'].password)) {
            if(!result['dataValues'].online) {
                await result.update({online: 1, lastConnection: Sequelize.literal('NOW()') });
                res.render('index.ejs', {ID: result['dataValues'].id});
            } else {
                // The account is already connected.
                res.render('index.ejs', {ID: 0});
            }
        } else {
            // The email or password is incorrect.
            res.render('index.ejs', {ID: 0});
        }
    } catch(e) {
        logger.error('Error:', {file: 'accountController.js', method:'getAccountByEmailAndPassword', message: e});
    }
}

module.exports = { getAccountByEmailAndPassword, createAccount }