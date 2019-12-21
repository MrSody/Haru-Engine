/* ------------------------------ *
    RUTAS
* ------------------------------ */
const express = require('express');
const router = express.Router();

//HOME - Game
router.get('/', (req, res) => {
    res.render('game.ejs');
});

module.exports = router;