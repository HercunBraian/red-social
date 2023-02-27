const express = require("express");
const router = express.Router();
const TecnicoController = require("../controllers/tecnicoController");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.get("/prueba", md_auth.auth, TecnicoController.pruebaTecnico);
router.post("/register", TecnicoController.register);
router.post("/login", TecnicoController.login);
router.get("/getTecnicos", md_auth.auth, TecnicoController.getTecnicos);
router.patch("/update/:id", md_auth.auth, TecnicoController.updateTecnico);
/* router.post("/login", UserController.login);
router.get("/profile/:id", md_auth.auth, UserController.profile);
router.get("/userMe", md_auth.auth, UserController.userMe);
router.get("/list/:page?", md_auth.auth, UserController.listUsers);
router.put("/update", md_auth.auth, UserController.updateUser);
router.post("/uploadimg", [md_auth.auth, uploads.single('file0')], UserController.uploadImg);
router.delete("/delete/:id", md_auth.auth, UserController.deleteUser);  */

// Exportar Router
module.exports = router;