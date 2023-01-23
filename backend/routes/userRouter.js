const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.get("/prueba-usuario", md_auth.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", md_auth.auth, UserController.profile);
router.get("/list/:page?", md_auth.auth, UserController.listUsers);

// Exportar Router
module.exports = router;