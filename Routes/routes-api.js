const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        miprimeraapi: "Works!"
    })
});

router.get("/game", (req, res) => {
    res.json({
        miprimeraapi: "GAme!"
    });
    router.get("/game/p", (req, res) => {
        res.json({
            miprimeraapi: "bien game!"
        });
    });

});

module.exports = router;