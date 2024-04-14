const Sequelize = require('sequelize');
const { models } = require('../../../database');
const bcrypt = require('bcrypt');
const { config } = require("../../../../config/config");

// LOGs
const log4js = require('log4js');
const logger = log4js.getLogger('app');
const loggerPlayers = log4js.getLogger('players');


/**
 * @async
 * @param {string} email
 * @returns {models.account}
 */
async function findAccount (email) {
    let result = await models.account.findOne({ 
        where: {
            email: email,
        },
    });

    return result;
}

async function createAccount (res, email, password) {

    try {
        let account = await findAccount(email);

        if (account == null) {
            const newAccount = await models.account.create({
                email: email,
                password: bcrypt.hashSync(password, config.saltPassword),
            });
        
            if (newAccount != null) {
                loggerPlayers.info(`Create account: ${email}`);
                await newAccount.update({online: 1, lastConnection: Sequelize.literal('NOW()') });
                res.render('index.ejs', {ID: newAccount['dataValues'].id});
            } else {
                res.render('register.ejs', {ID: 0, codeError: "CodeError.CreateAccountIncorrect"});
            }
        } else {
            console.log(account);
            res.render('register.ejs', {ID: 0, codeError: "CodeError.EmailAlreadyRegistered"});
        }

    } catch(e) {
        logger.error('Error:', {file: 'accountRepository.js', method:'createAccount', message: e});
        res.render('register.ejs', {ID: 0, codeError: "CodeError.Unknown"});
    }
}

async function getAccountByEmailAndPassword (res, email, password) {
    try {
        let account = await findAccount(email);

        if (account != null) {
            if (bcrypt.compareSync(password, account['dataValues'].password)) {
                await account.update({online: 1, lastConnection: Sequelize.literal('NOW()') });
                res.render('index.ejs', {ID: account['dataValues'].id});
            } else {
                res.render('login.ejs', {ID: 0, codeError: "CodeError.EmailPasswordIncorrect"});
            }
        } else {
            res.render('login.ejs', {ID: 0, codeError: "CodeError.EmailIncorrect"});
        }
    } catch(e) {
        logger.error('Error:', {file: 'accountRepository.js', method:'getAccountByEmailAndPassword', message: e});
        res.render('login.ejs', {ID: 0, codeError: "CodeError.Unknown"});
    }
}

module.exports = { getAccountByEmailAndPassword, createAccount }