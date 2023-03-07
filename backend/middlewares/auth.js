// Importar dependencias
const jwt = require("../services/jwt");

// Import clave Secreta
const libJwt = require("../services/jwt");
const secretJwt = libJwt.secretJwt;

// Funcion de autenticacion 
exports.auth = (req, res, next) => {

    // Comprobar si me llega la cabecera de autenticacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "Error",
            message: "La peticion no tiene la cabecera de Autenticacion"
        })
    }
    // Limpiar el token
    const token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar Token
    try {
        const payload = jwt.decoded(token);

        const { exp } = payload;
        const currenData = new Date().getTime();

        if (exp <= currenData) {
            return res.status(400).send({
                status: "Error",
                message: "El token ha expirado."
            })
        }

        // Agregar datos del usuario a la Request
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "Error",
            message: "Token Invalido"
        })
    }


    // Pasar a la ejecucion de accion
    next();
}