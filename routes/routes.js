/* ------------------------------ *
    RUTAS
* ------------------------------ */
const express = require('express');
const router = express.Router();

// CONNECTION TO DB
const DBAdapter = require("../engine/modules/dbAdapters/mySQLDBAdapter");
const conexion = DBAdapter();
const QUERYS = require('../engine/modules/querys').Querys;
const Query = new QUERYS();

// Controllers
const accountController = require('../app/controllers/page/accountController');

//HOME - Game
router.get('/', (req, res) => {
    res.render('index.ejs', {ID: 0});
});

router.post('/game', (req, res) => {
    let ID = req.body.id;
    res.render('game.ejs', {ID: ID});
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    accountController.getAccountByEmailAndPassword(res, email, password);
});

router.post('/registro', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    accountController.createAccount(res, email, password);  
});

module.exports = router;
