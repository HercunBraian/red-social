// Importar dependencias y modulos
const User = require("../models/user");
const Follow = require("../models/follow");
const Publication = require("../models/publication");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const fs = require("fs");
const path = require("path");

// Importar servicio FollowService
const followService = require("../services/followService");
const validate = require("../helpers/validator");

// Acciones de prueba

const pruebaUser = (req, res) => {
  return res.status(200).send({
    msg: "Mensaje enviado desde: controllers/userControllers.js",
    usuario: req.user,
  });
};

// Registro de Usuarios
const register = (req, res) => {
  // Traer datos de la Api
  const params = req.body;

  // Comprobar que me llegan bien + validacion
  if (!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      message: "Validacion Incorrecta",
    });
  }

  // Validacion Avanzada
  validate(params);

  // Control de usuarios duplicados
  User.find({
    $or: [
      { email: params.email.toLowerCase() },
      { nick: params.nick.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error)
      return res
        .status(500)
        .json({ message: "Error en la consulta de usuarios" });

    if (users && users.length >= 1) {
      return res.status(200).send({
        message: "El usuario ya existe",
      });
    }

    // Cifrar contraseña
    let hashPassword = await bcrypt.hash(params.password, 10);
    params.password = hashPassword;

    // Crear objeto de Usuario
    const newUser = new User(params);

    // Guardar datos en la BBDD
    newUser.save((error, userStored) => {
      if (error || !userStored)
        return res.status(400).send({ msg: "Error al crear el usuario" });

      // Devolver resultado
      return res.status(200).json({
        status: "success",
        message: "Usuario registrado correctamente",
        user: userStored,
      });
    });
  });
};

// Login de usuario
const login = (req, res) => {
  // Recoger parametros del Body
  const params = req.body;

  // Comprobar que llegan los datos
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "Error",
      message: "Faltan datos por enviar",
    });
  }

  // Buscar en la BBDD si existe el usuario
  User.findOne({ email: params.email })
    // .select({ "password": 0 })
    .exec((error, user) => {
      if (error || !user)
        return res.status(404).send({
          status: "Error",
          message: "No existe el usuario",
        });

      // Comprobar contraseña
      const pwd = bcrypt.compareSync(params.password, user.password);

      if (!pwd) {
        return res.status(400).send({
          status: "Error",
          message: "No te has indentificado correctamente",
        });
      }
      // Devolver Token
      const accessToken = jwt.createAccessToken(user);
      const refreshToken = jwt.createRefreshToken(user);
      // Devolver datos del Usuario

      return res.status(200).json({
        status: "success",
        message: "Accion de Login",
        user: {
          id: user._id,
          name: user.name,
          nick: user.nick,
          email: user.email,
        },
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    });
};

function refreshAccessToken(req, res){
  const {token} = req.body;

  if(!token){
    res.status(400).send({
      msg: "Token requerido"
    })
  }
  const {id} = jwt.decoded(token);

  User.findOne({_id: id}, (error, userStorage) => {
    if(error){
      return res.status(500).send({
        msg: "Error del servidor"
      })
    } else {
      res.status(200).send({
        accessToken: jwt.createAccessToken(userStorage)
      })
    }
  })
}

// Perfil de usuario
const profile = (req, res) => {
  //Recibir parametro de ID por la URL
  const id = req.params.id;

  // Consulta para sacar los datos del usuario
  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec(async (error, userProfile) => {
      if (error || !userProfile) {
        return res.status(404).send({
          status: "Error",
          message: "El usuario no existe o hay un error",
        });
      }

      // Informacion de seguimiento
      const followInfo = await followService.followThisUser(req.user.id, id);

      // Devolver resultado

      return res.status(200).send({
        status: "success",
        user: userProfile,
        following: followInfo.following,
        follower: followInfo.follower,
      });
    });
};

// Perfil de usuario Logueado
async function userMe( req, res){
  const id = req.user.id;

  const response = await User.findById(id)
  console.log(response)

  if(!response){
     res.status(400).send({msg:"No se ha encontrado usuario"})
  } else {
     res.status(200).send(response);
  }
}

// Lista de usuarios
const listUsers = (req, res) => {
  // Controlar en que pagina estamos
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  page = parseInt(page);

  // Consulta con mongoose pagination
  let itemxPage = 20;

  User.find()
    .select("-password -__v")
    .sort("_id")
    .paginate(page, itemxPage, async (error, users, total) => {
      if (error || !users) {
        return res.status(404).send({
          status: "error",
          message: "No hay usuarios disponibles",
          error,
        });
      }

      // Sacar array de ids de los usuarios que me siguen y los que sigo como Braian
      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "success",
        message: "Ruta de listado de Usuarios",
        users,
        page,
        itemxPage,
        total,
        pages: Math.ceil(total / itemxPage),
        userFollowings: followUserIds.following,
        userFollowMe: followUserIds.followers,
      });
    });
};

// Modificar usuario
const updateUser = (req, res) => {
  // Recoger informacion del usuario a Actualizar
  const userLogin = req.user;
  let userToUpdate = req.body;

  // Elimitar del req.user campos sobrantes
  delete userLogin.iat;
  delete userLogin.exp;
  delete userLogin.role;
  delete userLogin.image;

  if (userToUpdate.email) {
    // Comprobar si el usuario o email existen
    User.find({ email: userToUpdate.email.toLowerCase() }).exec(
      async (error, users) => {
        if (error)
          return res
            .status(500)
            .json({ message: "Error en la consulta de usuarios" });

        let userIsset = false;
        users.forEach((user) => {
          // Si el user ID que devuelve el for es diferente al ID del user logeado entonces
          // userIsset es true.
          if (user && user._id != userLogin.id) userIsset = true;
        });

        if (userIsset) {
          return res.status(200).send({
            message: "El email ya existe",
          });
        }

        // Cifrar contraseña
        if (userToUpdate.password) {
          let hashPassword = await bcrypt.hash(userToUpdate.password, 10);
          userToUpdate.password = hashPassword;
        } else {
          delete userToUpdate.password;
        }

        // Buscar y actualizar el usuario con la nueva info
        User.findByIdAndUpdate(
          userLogin.id,
          userToUpdate,
          { new: true },
          (error, userToUpdate) => {
            if (error || !userToUpdate) {
              return res.status(500).json({
                status: "Error",
                message: "Error al actualizar el usuario",
              });
            }
            return res.status(200).send({
              status: "success",
              message: "Metodo de actualizar Usuario",
              user: userToUpdate,
            });
          }
        );
      }
    );
  } else {
    if (userToUpdate.nick) {
      // Comprobar si el nick existe
      User.find({ nick: userToUpdate.nick.toLowerCase() }).exec(
        async (error, users) => {
          if (error)
            return res
              .status(500)
              .json({ message: "Error en la consulta de usuarios" });

          let userIsset = false;
          users.forEach((user) => {
            // Si el user ID que devuelve el for es diferente al ID del user logeado entonces
            // userIsset es true.
            if (user && user._id != userLogin.id) userIsset = true;
          });

          if (userIsset) {
            return res.status(200).send({
              message: "El nick ya existe",
            });
          }

          // Cifrar contraseña
          if (userToUpdate.password) {
            let hashPassword = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = hashPassword;
          } else {
            delete userToUpdate.password;
          }

          // Buscar y actualizar el usuario con la nueva info
          User.findByIdAndUpdate(
            userLogin.id,
            userToUpdate,
            { new: true },
            (error, userToUpdate) => {
              if (error || !userToUpdate) {
                return res.status(500).json({
                  status: "Error",
                  message: "Error al actualizar el usuario",
                });
              }
              return res.status(200).send({
                status: "success",
                message: "Metodo de actualizar Usuario",
                user: userToUpdate,
              });
            }
          );
        }
      );
    }
  }
};

// Cargar Avatar de Usuario
const uploadImg = (req, res) => {
  // Recoger informacion del usuario a Actualizar
  const userLogin = req.user;
  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: "Error",
      msg: "La peticion no incluye la imagen",
    });
  }

  // Conseguir el nombre del fichero
  let image = req.file.originalname;

  // Sacar la extension del archivo
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  // Comprobar extension
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // Si la extencion no es correcta borrar archivo subido y devolver respuesta negativa.
    const filePath = req.file.path;
    fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "Error",
      msg: "Extencion del fichero invalida",
      user: req.user.id,
    });
  }

  // Si es correcta, guardar imagen en bbdd
  User.findByIdAndUpdate(
    userLogin.id,
    { image: req.file.filename },
    { new: true },
    (error, userUpdate) => {
      if (error || !userUpdate) {
        return res.status(500).send({
          status: "Error",
          msg: "Error en la subida del avatar.",
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Carga de Imagen",
        user: userUpdate,
        file: req.file,
      });
    }
  );
};

// Eliminar Usuario
const deleteUser = (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "No se pudo borrar el usuario." });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      message: "Usuario borrado correctamente",
    });
  });
};

// Avatar
const avatar = (req, res) => {
  // Sacar el parametro de la URL
  const file = req.params.file;

  // Montar el path real de la imagen
  const filePath = "./uploads/avatars/" + file;

  // Comprobar que existe
  fs.stat(filePath, (error, exists) => {
    if (!exists)
      return res.status(404).send({
        status: "Error",
        msg: "No existe la imagen",
      });

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
};

// Accion de contador de publicaciones, seguidores y seguidos
const counter = async (req, res) => {
  let userId = req.user.id;

  if (req.params.id) {
    userId = req.params.id;
  }

  try {
    const following = await Follow.count({ user: userId });

    const followed = await Follow.count({ followed: userId });

    const publications = await Publication.count({ user: userId });

    return res.status(200).send({
      userId,
      following: following,
      followed: followed,
      publications: publications,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      msg: "No se ha podido realizar la consulta de contadores",
    });
  }
};

// Exportar Acciones
module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  userMe,
  listUsers,
  updateUser,
  uploadImg,
  deleteUser,
  avatar,
  counter,
  refreshAccessToken
};
