const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/clientController");
const md_auth = require("../middlewares/auth");

// Definir Rutas
router.get("/prueba-cliente", ClientController.pruebaClient);
router.post("/register", md_auth.auth, ClientController.register);
router.patch("/update/:id", md_auth.auth, ClientController.update);
router.get("/list", md_auth.auth, ClientController.list);
router.delete("/delete/:id", md_auth.auth, ClientController.deleteClient);
router.get("/profile/:id", md_auth.auth, ClientController.profile);
router.get("/listMachine/:id/:page?", md_auth.auth, ClientController.listMachine);
router.get("/listTicket/:id/:page?", md_auth.auth, ClientController.listTicket);

// Exportar Router
module.exports = router;