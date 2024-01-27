/* ------------------------------ *
    RUTAS
* ------------------------------ */
const express = require('express');
const router = express.Router();

// Controllers
const accountController = require('../../server/app/controllers/page/accountController');

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

router.get("*", (req, res) => {
    res.end("Archivo no encontrado")
});

module.exports = router;