// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Import clave Secreta
const libJwt = require("../services/jwt");
const secretJwt = libJwt.secretJwt;

// Funcion de autenticacion 
exports.auth = (req, res, next) => {

    // Comprobar si me llega la cabecera de autenticacion
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "Error",
            message: "La peticion no tiene la cabecera de Autenticacion"
        })
    }
    // Limpiar el token
    const token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar Token
    try {
        const payload = jwt.decode(token, secretJwt);

        // Comprobar expiracion de Token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
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