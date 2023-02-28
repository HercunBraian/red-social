const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const md_auth = require("../middlewares/auth");
const multer = require("multer");

// Configuracion de subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });

// Definir Rutas
router.get("/prueba-usuario", md_auth.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", md_auth.auth, UserController.profile);
router.get("/userMe", md_auth.auth, UserController.userMe);
router.get("/list", md_auth.auth, UserController.listUsers);
router.patch("/update/:id", md_auth.auth, UserController.updateUser);
router.post(
  "/uploadimg",
  [md_auth.auth, uploads.single("file0")],
  UserController.uploadImg
);
router.delete("/delete/:id", md_auth.auth, UserController.deleteUser);
router.get("/avatar/:file", md_auth.auth, UserController.avatar);
router.get("/counter/:id", md_auth.auth, UserController.counter);

// Exportar Router
module.exports = router;
