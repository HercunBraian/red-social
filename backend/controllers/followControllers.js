// Acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/followControllers.js"
    });
}

// Exportar Acciones
module.exports = {
    pruebaFollow
}