/* ------------------------------ *
    RUTAS
* ------------------------------ */
const express = require('express');
const router = express.Router();

// Controllers
const accountRepository = require('../../server/app/repositories/page/accountRepository');

/* ------------------------------ *
    PAGES
* ------------------------------ */

// HOME
router.get('/', (req, res) => {
    res.render('index.ejs', {ID: 0});
});

// Login
router.get('/login', (req, res) => {
    res.render('login.ejs', {ID: 0, codeError: null});
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    accountRepository.getAccountByEmailAndPassword(res, email, password);
});

// Register
router.get('/register', (req, res) => {
    res.render('register.ejs', {ID: 0, codeError: null});
});

router.post('/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    accountRepository.createAccount(res, email, password);  
});

// GAME
router.post('/game', (req, res) => {
    let ID = req.body.id;
    res.render('game.ejs', {ID: ID});
});

router.get("*", (req, res) => {
    res.end("Archivo no encontrado")
});

module.exports = router;