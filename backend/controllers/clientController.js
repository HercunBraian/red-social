// Importar dependencias y modulos
const Client = require("../models/client");
const mongoosePagination = require("mongoose-pagination");
const User = require("../models/user");
const Machine = require("../models/machine");
const Ticket = require("../models/ticket");

// Acciones de prueba
const pruebaClient = (req, res) => {
  return res.status(200).send({
    msg: "Mensaje enviado desde: controllers/clientControllers.js",
  });
};

// Registro de Clientes
const register = (req, res) => {
  // Traer datos de la Api
  const params = req.body;

  // Comprobar que me llegan bien + validacion
  if (!params.name || !params.direccion || !params.email || !params.phone) {
    return res.status(400).json({
      message: "Validacion Incorrecta",
    });
  }

  // Crear objeto de Usuario

  // Control de usuarios duplicados
  Client.find({
    $or: [{ email: params.email.toLowerCase() }, { name: params.name }],
  }).exec((error, clients) => {
    if (error)
      return res
        .status(500)
        .json({ message: "Error en la consulta de clientes" });

    if (clients && clients.length >= 1) {
      return res.status(200).send({
        message: "El cliente ya existe",
      });
    }

    const newClient = new Client(params);

    // Guardar datos en la BBDD
    newClient.save((error, clientStored) => {
      if (error || !clientStored)
        return res.status(400).send({ msg: "Error al crear el cliente" });

      // Devolver resultado
      return res.status(200).json({
        status: "success",
        message: "Cliente registrado correctamente",
        user: clientStored,
      });
    });
  });
};

// Funcion para obtener una lista de clientes.
const list = (req, res) => {
  // Controlar en que pagina estamos
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: "_id",
  };

  Client.paginate({}, options, (error, clients) => {
    if (error || !clients) {
      return res.status(404).send({
        status: "error",
        message: "No hay clientes disponibles",
        error,
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Ruta de listado de Clientes",
      clients,
    });
  });

  // Devolver Resultado posteriormente info de Follows
};

// Listado de maquinas asignadas al cliente
const listMachine = (req, res) => {
  // Sacar el id del cliente
  let clientId = req.params.id;

  // Comprobar si me llega el id por parametro en url
  if (req.params.id) clientId = req.params.id;

  // Comprobar si me llega la pagina, si no la pagina 1
  let page = 1;

  if (req.params.page) page = req.params.page;

  // Usuarios por pagina quiero mostrar
  const itemPerPage = 5;

  // Find a Follow, popular datos  de los usuarios y paginar con mongoose paginate
  Machine.find({ client: clientId }).paginate(
    page,
    itemPerPage,
    async (error, machines, total) => {
      return res.status(200).send({
        status: "Success",
        message: "Listado de maquinas que tiene el cliente",
        machines,
        total,
        pages: Math.ceil(total / itemPerPage),
      });
    }
  );
};

// Listado de tickets asignadas al cliente
const listTicket = (req, res) => {
  // Sacar el id del cliente
  let clientId = req.params.id;

  // Comprobar si me llega el id por parametro en url
  if (req.params.id) clientId = req.params.id;

  // Comprobar si me llega la pagina, si no la pagina 1
  let page = 1;

  if (req.params.page) page = req.params.page;

  // Usuarios por pagina quiero mostrar
  const itemPerPage = 5;

  // Find a Follow, popular datos  de los usuarios y paginar con mongoose paginate
  Ticket.find({ client: clientId }).paginate(
    page,
    itemPerPage,
    async (error, tickets, total) => {
      return res.status(200).send({
        status: "Success",
        message: "Listado de tickets que tiene el cliente",
        tickets,
        total,
        pages: Math.ceil(total / itemPerPage),
      });
    }
  );
};

// Perfil de cliente
const profile = (req, res) => {
  //Recibir parametro de ID por la URL
  const id = req.params.id;

  // Consulta para sacar los datos del cliente
  Client.findById(id).exec((error, clientProfile) => {
    if (error || !clientProfile) {
      return res.status(404).send({
        status: "Error",
        message: "El cliente no existe o hay un error",
      });
    }
    // Devolver resultado
    return res.status(200).send({
      status: "success",
      client: clientProfile,
    });
  });
};

// Modificar cliente
const update = (req, res) => {
  const { id } = req.params;
  const clientData = req.body;

  if (clientData.email) {
    Client.find({ email: clientData.email.toLowerCase() }).exec(
      async (error, clientes) => {
        if (error)
          return res
            .status(500)
            .json({ message: "Error en la consulta de clientes" });

        let clientIsset = false;
        clientes.forEach((cliente) => {
          // Si el cliente ID que devuelve el for es diferente al ID del cliente del params
          // userIsset es true.

          if (cliente && { _id: id } != clientData.email) clientIsset = true;
        });

        if (clientIsset) {
          return res.status(200).send({
            message: "El cliente ya existe",
          });
        }

        // Buscar y actualizar el usuario con la nueva info
        Client.findByIdAndUpdate(
          { _id: id },
          clientData,
          { new: true },
          (error, clientData) => {
            if (error || !clientData) {
              return res.status(500).json({
                status: "Error",
                message: "Error al actualizar el cliente",
              });
            }
            return res.status(200).send({
              status: "success",
              message: "Metodo de actualizar cliente",
              Client: clientData,
            });
          }
        );
      }
    );
  } else {
    Client.findByIdAndUpdate({ _id: id }, clientData, (error) => {
      if (error) {
        res.status(400).send({ msg: "Error al actualizar el cliente." });
      }

      // Devolver resultado
      return res.status(200).json({
        status: "success",
        message: "Cliente modificado correctamente",
        client: clientData,
      });
    });
  }
};

// Eliminar Cliente
const deleteClient = (req, res) => {
  const { id } = req.params;

  Client.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "No se pudo borrar el usuario." });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      message: "Cliente borrado correctamente",
    });
  });
};

// Exportar Acciones
module.exports = {
  pruebaClient,
  register,
  update,
  list,
  deleteClient,
  profile,
  listMachine,
  listTicket,
};
