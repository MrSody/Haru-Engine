const { models } = require('../../../database');

async function createAccount (res, email, password) {

    try {
        const result = await models.account.create({
            email: email,
            password: password
        });
    
        if (result != null) {
            console.log("Cuenta creada");
        } else {
            throw`no se pudo crear la cuenta`;
        }
    } catch(e) {
        console.log(`Error: accountController - createAccount: ${e}`);
    }
}

async function getAccountByEmailAndPassword (res, email, password) {
    try {
        var result = await models.account.findOne({ 
            where: {
                email: email,
                password: password
            }
        });

        if (result != null) {
            res.render('index.ejs', {ID: result['dataValues'].id});
        } else {
            res.render('index.ejs', {ID: 0});
        }
    } catch(e) {
        console.log(`Error: accountController - getAccountByEmailAndPassword: ${e}`);
    }
}

module.exports = { getAccountByEmailAndPassword, createAccount }