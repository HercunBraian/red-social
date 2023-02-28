// Importar dependencias
const connection = require("../backend/BD/connection");
const express = require("express");
const cors = require("cors");
// Mensaje de bienvenida
console.log("API NODE RED SOCIAL FUNCIONANDO CORRECTAMENTE");

// Conexion a la BBDD
connection();

// Crear servidor de Node
const app = express();
const puerto = 3900;

// Configurar CORS
app.use(cors());

// Convertir los datos del BODY a objetos JS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar conf Rutas
const UserRoutes = require("./routes/userRouter");
const PublicationRoutes = require("./routes/publicationRouter");
const FollowRoutes = require("./routes/followRouter");
const ClientRoutes = require("./routes/clientRouter");
const TicketRouter = require("./routes/ticketRouter");
const ComentRouter = require("./routes/comentRouter");
const MachineRouter = require("./routes/machineRouter");
const DepartmentRouter = require("./routes/deparmentRouter");
const TecnicoRouter = require("./routes/tecnicoRouter");

app.use("/api/user", UserRoutes);
app.use("/api/follow", FollowRoutes);
app.use("/api/client", ClientRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/ticket", TicketRouter);
app.use("/api/coment", ComentRouter);
app.use("/api/machine", MachineRouter);
app.use("/api/department", DepartmentRouter);
app.use("/api/tecnico", TecnicoRouter);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
  return res.status(200).json({
    id: 1,
    nombre: "Braian",
    web: "Bhercun@gmail.com",
  });
});

// Poner servidor a escuchar peticion HTTP
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto: ", puerto);
});
