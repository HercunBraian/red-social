const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publicationsControllers");
const md_auth = require("../middlewares/auth");
const multer = require("multer");

// Configuracion de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/publications/")
    },
    filename: (req, file, cb) =>{
        cb(null, "pub-"+Date.now()+"-"+file.originalname)
    }
});

const uploads = multer({storage});

// Definir Rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);
router.post("/save",md_auth.auth, PublicationController.save);
router.get("/detail/:id",md_auth.auth, PublicationController.detail);
router.delete("/delete/:id",md_auth.auth, PublicationController.deletePublication);
router.get("/listUser/:id/:page?",md_auth.auth, PublicationController.listUser);
router.post("/upload/:id",[md_auth.auth, uploads.single('file0')], PublicationController.uploadImg);
router.get("/media/:file", PublicationController.media);
router.get("/feed/:page?",md_auth.auth, PublicationController.feed);
// Exportar Router
module.exports = router;