const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publicationsControllers");

// Definir Rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);

// Exportar Router
module.exports = router;