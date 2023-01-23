const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// Definir Rutas
router.get("/prueba-usuario", UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Exportar Router
module.exports = router;