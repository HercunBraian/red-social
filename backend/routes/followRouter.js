// Importar modulos

const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/followControllers");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.get("/prueba-follow", FollowController.pruebaFollow);
router.post("/save", md_auth.auth, FollowController.save);
router.delete("/unfollow/:id", md_auth.auth, FollowController.unfollow);
router.get("/unfollow/:id?/:page?", md_auth.auth, FollowController.following);
router.get("/following/:id?/:page?", md_auth.auth, FollowController.following);
router.get("/followers/:id?/:page?", md_auth.auth, FollowController.followers);


// Exportar Router
module.exports = router;