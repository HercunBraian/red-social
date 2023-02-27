// Importar dependencias y Modelos
const Publication = require("../models/publication");

// Importar modulos
const fs = require("fs");
const path = require("path")

// Importar servicios
const followService = require("../services/followService");
// Acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/publicationControllers.js"
    });
}

const save = (req, res) => {

    // Recoger datos del body
    const params = req.body;

    // Si no llega la info  dar respuesta negativa
    if (!params.text) return res.status(400).send({
        status: "Error",
        msg: "Debes enviar el texto de la publicacion"
    });

    // Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id

    // Guardar objeto en BBDD
    newPublication.save((error, publicationStored) => {
        if (error || !publicationStored) return res.status(400).send({
            status: "Error",
            msg: "No se ha guardado la publicacion"
        });

        // Devolver Repuesta
        return res.status(200).send({
            msg: "Publicacion Guardada",
            publicationStored
        });
    })
}

// Sacar una Publicacion
const detail = (req, res) => {

    // Sacar id de publicacion de la URL
    const publicationId = req.params.id;

    // Find con condicion de ID
    Publication.findById(publicationId, (error, publicationStored) => {

        if (error || !publicationStored) return res.status(400)({
            status: "Error",
            msg: "No existe la publicacion"
        })
        // Devolver una respuesta
        res.status(200).send({
            status: "Success",
            msg: "Prueba",
            publication: publicationStored
        })
    });
}

// Eliminar Publicaciones
const deletePublication = (req, res) => {
    // Sacar el id de la publicacion al sacar
    const publicationId = req.params.id

    // Find de publicacion
    Publication.find({ "user": req.user.id, "_id": publicationId }).remove(error => {
        if (error) return res.status(500).send({
            status: "Error",
            msg: "Error al eliminar la publicacion"
        })

        return res.status(200).send({
            status: "success",
            msg: "Publicacion Eliminada",
            publication: publicationId
        })
    })
}

// Listar Publicaciones de un usuario
const listUser = (req, res) => {

    // Sacar id del usuario
    const userId = req.params.id;

    // Controlar la pagina
    let page = 1;

    if (req.params.page) page = req.params.page;

    const itemsPerPage = 5;

    // Find, populate, ordenar, paginar
    Publication.find({ "user": userId })
        .sort("-created_at")
        .populate('user', '-password -__v -role')
        .paginate(page, itemsPerPage, (error, publications, total) => {

            if (error || publications.length <= 0) {
                return res.status(404).send({
                    status: "Error",
                    msg: "No hay publicaciones para mostrar"
                });
            }
            // Devolver respuesta
            return res.status(200).send({
                status: "success",
                msg: "Publicaciones del perfil de un usuairo",
                page,
                total,
                pages: Math.ceil(total / itemsPerPage),
                publicaciones: publications

            })
        })

}

// Subir ficheros
const uploadImg = async (req, res) => {
    // Recoger informacion del usuario a Actualizar
    const userLogin = req.user.id;

    // Sacar ID de Publicacion
    const publicationId = req.params.id;

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "Error",
            msg: "La peticion no incluye la imagen"
        })
    }

    // Conseguir el nombre del fichero
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.")
    const extension = imageSplit[1];

    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        // Si la extencion no es correcta borrar archivo subido y devolver respuesta negativa.
        const filePath = req.file.path;
        fs.unlinkSync(filePath);

        return res.status(400).send({
            status: "Error",
            msg: "Extencion del fichero invalida",
            user: req.user.id
        })
    }

    // Buscamos la publicacion por el ID y filtramos por Usuario Logueado
    /*  let publicationUser = await Publication.findOne({user:userLogin ,_id: publicationId});
     console.log(publicationUser) */

    // Si es correcta, guardar imagen en bbdd
    Publication.findOneAndUpdate({ user: userLogin, _id: publicationId }, { file: req.file.filename }, { new: true }, (error, publicationUpdate) => {
        if (error || !publicationUpdate) {
            return res.status(500).send({
                status: "Error",
                msg: "Error en la subida de la imagen."
            })
        }
        return res.status(200).send({
            status: "success",
            message: "Carga de Imagen",
            publication: publicationUpdate,
            file: req.file

        })
    })

}

// Devolver Archivos Multimedias Imagenes
const media = (req, res) => {
    // Sacar el parametro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {
        if (!exists) return res.status(404).send({
            status: "Error",
            msg: "No existe la imagen"
        });

        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    })

}

// Listar Publicaciones del FEED

const feed = async (req, res) => {
    // Sacar la pagina actual
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    // Establecer numero de elementos por pagina 
    let itemsPerPage = 5;

    // Sacar array de identificadores de usuarios que yo sigo como usuario identificado
    try {
        const myFollows = await followService.followUserIds(req.user.id);

        // Find a publicaciones in, ordenar, popular, paginar
        // Otra forma de hacerlo es la siguiente
        // user: {"$in": myFollows.following}
        const publications = Publication.find({ user: myFollows.following })
            .populate("user", "-password -role -__v -email")
            .sort("-created_at")
            .paginate(page, itemsPerPage, (error, publications, total) => {

                if (error || !publications) {
                    return res.status(200).send({
                        status: "error",
                        msg: "No hay publicaciones para mostrar",
                    })
                }
                return res.status(200).send({
                    status: "success",
                    msg: "Feed de publicaciones",
                    following: myFollows.following,
                    total,
                    page,
                    pages: Math.ceil(total / itemsPerPage),
                    publications
                })
            })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            msg: "No se han listado las publicaciones del feed"
        })
    }

    // Find a publicaciones utilizando operador IN


}


// Exportar Acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    deletePublication,
    listUser,
    uploadImg,
    media,
    feed
}