// Importar dependencias y modulos
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Acciones de prueba

const pruebaUser = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/userControllers.js"
    });
}

// Registro de Usuarios

const register = (req, res) => {
    // Traer datos de la Api
    const params = req.body;

    // Comprobar que me llegan bien + validacion
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            message: "Validacion Incorrecta"
        });
    }

    // Control de usuarios duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    }).exec(async (error, users) => {
        if (error) return res.status(500).json({ message: "Error en la consulta de usuarios" });

        if (users && users.length >= 1) {
            return res.status(200).send({
                message: "El usuario ya existe"
            })
        }

        // Cifrar contraseña
        let hashPassword = await bcrypt.hash(params.password, 10);
        params.password = hashPassword;

        // Crear objeto de Usuario
        const newUser = new User(params);

        // Guardar datos en la BBDD
        newUser.save((error, userStored) => {
            if (error || !userStored) return res.status(400).send({ msg: "Error al crear el usuario" })

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });
        });
    });


}

const login = (req, res) => {
    // Recoger parametros del Body
    const params = req.body;

    // Comprobar que llegan los datos
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "Error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar en la BBDD si existe el usuario
    User.findOne({ email: params.email })
       // .select({ "password": 0 })
        .exec((error, user) => {
            if (error || !user) return res.status(404).send({
                status: "Error",
                message: "No existe el usuario"
            });

            // Comprobar contraseña 
            const pwd = bcrypt.compareSync(params.password, user.password);

            if(!pwd){
                return res.status(400).send({
                    status: "Error",
                    message: "No te has indentificado correctamente"
                })
            }
            // Devolver Token

            // Devolver datos del Usuario

            return res.status(200).json({
                status: "success",
                message: "Accion de Login",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick,
                }
            })
        })



}
// Exportar Acciones
module.exports = {
    pruebaUser,
    register,
    login
}