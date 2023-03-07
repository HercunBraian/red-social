const express = require("express");
const router = express.Router();
const MachineContrller = require("../controllers/machineController");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.get("/prueba", md_auth.auth, MachineContrller.pruebaMachine);
router.post("/save", md_auth.auth, MachineContrller.addMachine);
router.get("/list/:page?", md_auth.auth, MachineContrller.getMachines);
router.get("/list/:page?", md_auth.auth, MachineContrller.list);
router.get("/perfil/:id", md_auth.auth, MachineContrller.getMachine);
router.delete("/delete/:id", md_auth.auth, MachineContrller.deleteMachine);

// Exportar Router
module.exports = router;