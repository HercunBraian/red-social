// Importar modulos

const express = require("express");
const router = express.Router();
const DepartmentController = require("../controllers/departmentController");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.get("/prueba", md_auth.auth, DepartmentController.prueba);
router.post("/save", md_auth.auth, DepartmentController.save);
router.get("/list/:page?", md_auth.auth, DepartmentController.getDeparments);
router.patch("/update/:id", md_auth.auth, DepartmentController.update);
router.delete("/delete/:id", md_auth.auth, DepartmentController.deleteDepartment);
router.get("/profile/:id", md_auth.auth, DepartmentController.profile);

// Exportar Router
module.exports = router;