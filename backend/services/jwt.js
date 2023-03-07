// Importar dependencias
const jwt = require("jsonwebtoken");

// Clave Secreta
const secretJwt = "s32das__123sxs123dk_2112";

function createAccessToken(user) {
    const expToken = new Date();
    expToken.setHours(expToken.getMinutes() + 1);

    const payload = {
        token_type: "access",
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: Date.now(),
        exp: expToken.getTime(),
    }

    return jwt.sign(payload, secretJwt)
}

function createRefreshToken(user) {
    const expToken = new Date();
    expToken.getMonth(expToken.getMinutes() + 1)

    const payload = {
        token_type: "refresh",
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: Date.now(),
        exp: expToken.getTime(),
    }

    return jwt.sign(payload, secretJwt)
}

// Devolver token codificado
function decoded(token) {
    return jwt.decode(token, secretJwt, true)
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    decoded
}
/* // Crear una funcion para generar Token
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
} */