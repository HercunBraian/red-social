// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave Secreta
const secretJwt = "s32das__123sxs123dk_2112";

// Crear una funcion para generar Token
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    // Devolver Token codificado
    return jwt.encode(payload, secretJwt);
}

module.exports = {
    secretJwt,
    createToken
}