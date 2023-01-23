// Acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/publicationControllers.js"
    });
}

// Exportar Acciones
module.exports = {
    pruebaPublication
}