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
router.get("/count-repair/:id", md_auth.auth, MachineContrller.getRepairCount);
// Equipos en total
router.get("/count-repair-month", md_auth.auth, MachineContrller.getLastMonthRepairCount);
// Equipos reparaciones por Id
router.get("/count-repair-monthId/:id", md_auth.auth, MachineContrller.getLastMonthRepairCountForMachine);
// Reparaciones por Mes
router.get("/monthly-repair-counts", md_auth.auth, MachineContrller.getMonthlyRepairCounts);

// Exportar Router
module.exports = router;