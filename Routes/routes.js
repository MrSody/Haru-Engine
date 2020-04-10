/* ------------------------------ *
    RUTAS
* ------------------------------ */
const express = require('express');
const router = express.Router();

// CONNECTION TO DB
const DBAdapter = require("../Engine/Modules/DBAdapters/MySQLDBAdapter");
const conexion = DBAdapter();

//HOME - Game
router.get('/', (req, res) => {
    res.render('index.ejs', {ID: 0});
});

router.post('/game', (req, res) => {
    let ID = req.body.id;
    res.render('game.ejs', {ID: ID});
});

router.post('/login', (req, res) => {
    let us = req.body.usLogin;
    let clave = req.body.claveLogin;
    console.log("repueta "+ us);

    getAccount(res, us, clave);
});

router.post('/registro', (req, res) => {
    let nick = req.body.nickName;
    let us = req.body.us;
    let clave = req.body.clave;
    let correo = req.body.correo;
    console.log("repueta "+ us);

    insertAccount(us, clave, nick, correo);  
});

function getAccount (res, user, password) {
    conexion.query("select * from Cuenta where Usuario=? and Clave=?", [user, password], (err, results) => {

        if (!err) {
            if (results.length > 0) {
                console.log('account ', results);
                res.render('index.ejs', {ID: results[0].ID});
            } else {
                console.log("Error:  no existe");
            }
        } else {
            console.log("Error: no esta en base de datos");
        }
    }); 
}

function insertAccount (user, password, nick, email) {
    let query = "INSERT INTO Cuenta (Usuario, Clave, NickName, Correo, Fecha_Creacion) VALUES (?, ?, ?, ?, Now())";

    //find account connect
    conexion.query(query, [user, password, nick, email], (err, results) => {

        if (!err) {
            //getAccount(user, password);
            console.log("Cuenta creada");
        } else {
            throw err;
        }
    });
}

module.exports = router;