const express = require("express");
const router = express.Router();
const ComentController = require("../controllers/comentController");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.put("/prueba-coment", ComentController.pruebaComent);
router.post("/save/:id", md_auth.auth, ComentController.addComent);
router.get("/get-coment/:id", md_auth.auth, ComentController.getComent);
router.delete("/delete/:id", md_auth.auth, ComentController.deleteComent);
router.put("/update/:id", md_auth.auth, ComentController.updateComent);

// Exportar Router
module.exports = router;