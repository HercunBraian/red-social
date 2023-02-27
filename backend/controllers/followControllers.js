// importar Modelo
const Follow = require("../models/follow");
const User = require("../models/user");
const mongoosePaginate = require("mongoose-pagination");
const Publication = require("../models/publication");


// Importar servicio
const followService = require("../services/followService");

// Acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/followControllers.js"
    });
}

// Accion de guardar un follow (Seguir)
const save = (req, res) => {

    // Conseguir datos de a quien voy a seguir (Conseguir datos por body)
    const params = req.body;

    // Sacar id del usuario identificado
    const userLogin = req.user;

    // Crear objeto con modelo follow
    let userToFollow = new Follow({
        user: userLogin.id,
        followed: params.followed
    })
    // Guardar objeto en bbdd

    userToFollow.save((error, followStored) => {
        if (error || !followStored) {
            return res.status(500).send({
                status: "Error",
                message: "No se ha podido seguir al usuario",
            })
        }

        return res.status(200).send({
            status: "Success",
            userLogin: req.user,
            follow: followStored
        })
    })
}

// Accion de borrar un follow (Dejar de seguir)
const unfollow = (req, res) => {
    // Recoger el id del usuario identificado
    const userLogin = req.user.id;

    // Recoger el id del usuario unfollow 
    const followedId = req.params.id;

    // Find del follow que coincida con el id del usuario identificado y el id del usuario que sigo
    // Y quiero dejar de seguir y hacer remove.
    Follow.find({
        "user": userLogin,
        "followed": followedId
    }).remove((error, followStored) => {

        if (error) {
            return res.status(400).send({
                status: "error",
                message: "No has dejado de seguir a nadie"
            });
        }
        return res.status(200).send({
            status: "Success",
            message: "Follow eliminado correctamente",
            UserLogin: userLogin,
            followStored
        });
    })



}

// Accion listado de usuario que estoy siguiendo
const following = (req, res) => {

    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por parametro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina, si no la pagina 1
    let page = 1;

    if (req.params.page) page = req.params.page

    // Usuarios por pagina quiero mostrar
    const itemPerPage = 5;

    // Find a Follow, popular datos  de los usuarios y paginar con mongoose paginate
    Follow.find({ user: userId })
        .populate("user followed", "-password -role -__v -email")
        .paginate(page, itemPerPage, async (error, follows, total) => {

            // Listado de usuarios de Daiana y soy Braian

            // Sacar array de ids de los usuarios que me siguen y los que sigo como Braian
            let followUserIds = await followService.followUserIds(userId);

            return res.status(200).send({
                status: "Success",
                message: "Listado de usuarios que sigo",
                follows,
                total,
                pages: Math.ceil(total / itemPerPage),
                userFollowings: followUserIds.following,
                userFollowMe: followUserIds.followers
            });
        })
}

// Accion listado de usuarios que me siguen
const followers = (req, res) => {
    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por parametro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina, si no la pagina 1
    let page = 1;

    if (req.params.page) page = req.params.page

    // Usuarios por pagina quiero mostrar
    const itemPerPage = 5;

    // Find a Follow, popular datos  de los usuarios y paginar con mongoose paginate
    Follow.find({ followed: userId })
        .populate("user followed", "-password -role -__v")
        .paginate(page, itemPerPage, async (error, follows, total) => {

            // Listado de usuarios de Daiana y soy Braian

            // Sacar array de ids de los usuarios que me siguen y los que sigo como Braian
            let followUserIds = await followService.followUserIds(userId);

            return res.status(200).send({
                status: "Success",
                message: "Listado de usuarios que me siguen",
                follows,
                total,
                pages: Math.ceil(total / itemPerPage),
                userFollowings: followUserIds.following,
                userFollowMe: followUserIds.followers
            });
        })
}


// Exportar Acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}