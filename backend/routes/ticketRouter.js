const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticketController");
const md_auth = require("../middlewares/auth");
const multer = require("multer");

// Configuracion de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/tickets/")
    },
    filename: (req, file, cb) =>{
        cb(null, "ticket-"+Date.now()+"-"+file.originalname)
    }
});

const uploads = multer({storage: storage});

// Definir Rutas
router.get("/prueba-ticket", md_auth.auth, TicketController.pruebaTicket);
router.post("/save", md_auth.auth, TicketController.save);
router.get("/list-my-tickets", md_auth.auth, TicketController.listMyTickets);
router.get("/getTickets/:page?", md_auth.auth, TicketController.getTickets);
router.patch("/update/:id", md_auth.auth, TicketController.updateTicket);
router.delete("/delete/:id", md_auth.auth, TicketController.ticketDelete);
router.get("/perfil/:id", md_auth.auth, TicketController.profile);
router.get("/count", md_auth.auth, TicketController.ticketCount);
router.get("/countClose", md_auth.auth, TicketController.ticketCountClose);

//router.post("/uploadimg", [md_auth.auth, uploads.single('file0')], UserController.uploadImg);

// Exportar Router
module.exports = router;