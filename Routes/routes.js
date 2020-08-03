/* ------------------------------ *
    RUTAS
* ------------------------------ */
const express = require('express');
const router = express.Router();

// CONNECTION TO DB
const DBAdapter = require("../Engine/Modules/DBAdapters/MySQLDBAdapter");
const conexion = DBAdapter();
const QUERYS = require('../Engine/Modules/Querys').Querys;
const Query = new QUERYS();

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

    getAccount(res, email, password);
});

router.post('/registro', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    insertAccount(res, email, password);  
});

function getAccount (res, email, password) {
    conexion.query(Query.getLogin(), [email, password], (err, results) => {

        if (!err) {
            if (results.length > 0) {
                res.render('index.ejs', {ID: results[0].ID});
            } else {
                res.render('index.ejs', {ID: 0});
                console.log(`Error - Routes - getAccount:  no existe`);
            }
        } else {
            console.log(`Error - Routes - getAccount: no esta en base de datos ${err}`);
        }
    }); 
}

function insertAccount (res, email, password) {
    //find account connect
    conexion.query(Query.getReguister(), [email, password], (err, results) => {

        if (!err) {
            getAccount(res, user, password);
            console.log("Cuenta creada");
        } else {
            console.log(`Error - Routes - insertAccount:  no existe ${err}`);
        }
    });
}

module.exports = router;