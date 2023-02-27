// Importar dependencias
const Tecnico = require("../models/tecnico");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const fs = require("fs");


// Acciones de prueba
const pruebaTecnico = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/tecnicoController.js",
    });
}

// Registro de Usuarios
const register = (req, res) => {
    // Traer datos de la Api
    const params = req.body;

    // Comprobar que me llegan bien + validacion
    if (!params.name || !params.email || !params.password || !params.rol) {
        return res.status(400).json({
            message: "Validacion Incorrecta"
        });
    }

    // Control de usuarios duplicados
    Tecnico.find({ email: params.email.toLowerCase() }).exec(async (error, tecnicos) => {
        if (error) return res.status(500).json({ message: "Error en la consulta de tecnicos" });

        if (tecnicos && tecnicos.length >= 1) {
            return res.status(200).send({
                message: "El tecnico ya existe"
            })
        }

        // Cifrar contraseña
        let hashPassword = await bcrypt.hash(params.password, 10);
        params.password = hashPassword;

        // Crear objeto de Usuario
        const newTecnico = new Tecnico(params);

        // Guardar datos en la BBDD
        newTecnico.save((error, tecnicoStored) => {
            if (error || !tecnicoStored) return res.status(400).send({ msg: "Error al crear el tecnico" })

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Tecnico registrado correctamente",
                tecnico: tecnicoStored
            });
        });
    });


}

// Login de usuario
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
    Tecnico.findOne({ email: params.email })
        // .select({ "password": 0 })
        .exec((error, tecnico) => {
            if (error || !tecnico) return res.status(404).send({
                status: "Error",
                message: "No existe el tecnico"
            });

            // Comprobar contraseña 
            const pwd = bcrypt.compareSync(params.password, tecnico.password);

            if (!pwd) {
                return res.status(400).send({
                    status: "Error",
                    message: "No te has indentificado correctamente"
                })
            }
            // Devolver Token
            const token = jwt.createToken(tecnico);
            // Devolver datos del Usuario

            return res.status(200).json({
                status: "success",
                message: "Accion de Login",
                tecnico: {
                    id: tecnico._id,
                    name: tecnico.name,
                    email: tecnico.email,
                },
                token
            })
        })



}

// Listado de Tecnicos
const getTecnicos = async (req, res) => {
    const { isActive } = req.query;

    let response = null;

    if (isActive === undefined) {
        response = await Tecnico.find();
    } else {
        response = await Tecnico.find({ isActive })
    }

    // Devolver resultado
    return res.status(200).json({
        status: "success",
        message: "Listado de tecnicos",
        Listado: response
    });
}

// Modificar usuario
const updateTecnico = async (req, res) => {
    // Recoger informacion del usuario a Actualizar
    let tecnicoToUpdate = req.body;
    let { id } = req.params;

    if (tecnicoToUpdate.email) {
        // Comprobar si el usuario o email existen
        Tecnico.find({ email: tecnicoToUpdate.email.toLowerCase() }).exec(async (error, tecnicos) => {
            if (error) return res.status(500).json({ message: "Error en la consulta de tecnicos" });

            let userIsset = false;
            tecnicos.forEach(tecnico => {
                // Si el user ID que devuelve el for es diferente al ID del user logeado entonces
                // userIsset es true.
  
                if (tecnico && { _id: id } != tecnicoToUpdate.email) userIsset = true;
            });

            if (userIsset) {
                return res.status(200).send({
                    message: "El tecnico ya existe"
                })
            }

            if (tecnicoToUpdate.password) {
                let hashPassword = await bcrypt.hash(tecnicoToUpdate.password, 10);
                tecnicoToUpdate.password = hashPassword;
            }

            // Buscar y actualizar el usuario con la nueva info
            Tecnico.findByIdAndUpdate({ _id: id }, tecnicoToUpdate, { new: true }, (error, tecnicoToUpdate) => {

                if (error || !tecnicoToUpdate) {
                    return res.status(500).json({
                        status: "Error",
                        message: "Error al actualizar el usuario"
                    })
                }
                return res.status(200).send({
                    status: "success",
                    message: "Metodo de actualizar Usuario",
                    user: tecnicoToUpdate
                })
            })
        });
    } else {
        if (tecnicoToUpdate.password) {
            let hashPassword = await bcrypt.hash(tecnicoToUpdate.password, 10);
            tecnicoToUpdate.password = hashPassword;
        }
        // Buscar y actualizar el usuario con la nueva info
        Tecnico.findByIdAndUpdate({ _id: id }, tecnicoToUpdate, { new: true }, (error, tecnicoToUpdate) => {

            if (error || !tecnicoToUpdate) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error al actualizar el usuario"
                })
            }
            return res.status(200).send({
                status: "success",
                message: "Metodo de actualizar Usuario",
                user: tecnicoToUpdate
            })
        })
    }
}

// Exportar Acciones
module.exports = {
    pruebaTecnico,
    register,
    login,
    getTecnicos,
    updateTecnico
}