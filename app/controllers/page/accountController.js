const { models } = require('../../../database');

// LOGs
const log4js = require('log4js');
const logger = log4js.getLogger('app');
const loggerPlayers = log4js.getLogger('players');

async function createAccount (res, email, password) {

    try {
        const result = await models.account.create({
            email: email,
            password: password,
        });
    
        if (result != null) {
            loggerPlayers.info(`Create account: ${email}`);
        } else {
            throw new Error(`The account couldn't be created.`);
        }
    } catch(e) {
        logger.error('Error:', {file: 'accountController.js', method:'createAccount', message: e});
    }
}

async function getAccountByEmailAndPassword (res, email, password) {
    try {
        let result = await models.account.findOne({ 
            where: {
                email: email,
                password: password,
            },
        });

        if (result != null) {
            res.render('index.ejs', {ID: result['dataValues'].id});
        } else {
            res.render('index.ejs', {ID: 0});
        }
    } catch(e) {
        logger.error('Error:', {file: 'accountController.js', method:'getAccountByEmailAndPassword', message: e});
    }
}

module.exports = { getAccountByEmailAndPassword, createAccount }