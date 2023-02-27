// importar Modelo
const Ticket = require("../models/ticket");
const User = require("../models/user");
const Client = require("../models/client")
const mongoosePaginate = require("mongoose-pagination");

// Acciones de prueba
const pruebaTicket = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/ticketControllers.js"
    });
}

// Crear ticket
const save = (req, res) => {

    // Conseguir datos del body
    const params = req.body;

    // Recoger el id del cliente asignar el ticket 
    const clientId = params.client;

    // Sacar id del usuario identificado
    const userLogin = req.user;

    // Comprobar que me llegan bien + validacion
    if (!params.client || !params.title || !params.priority || !params.obs || !params.department) {
        return res.status(400).json({
            message: "Validacion Incorrecta"
        });
    }

    // Crear objeto con modelo ticket
    let newTicket = new Ticket({ ...req.body, user: userLogin.id, status: true });
    // Guardar objeto en bbdd
    console.log(newTicket)
    newTicket.save((error, ticketStored) => {
        if (error || !ticketStored) {
            return res.status(500).send({
                status: "Error",
                message: "No se ha podido crear el ticket usuario",
            })
        }

        return res.status(200).send({
            status: "Success",
            ticketStored
        })
    })
}

// Listado de tickets que tiene el usuario logueado
const listMyTickets = (req, res) => {
    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por parametro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina, si no la pagina 1
    let page = 1;

    if (req.params.page) page = req.params.page

    // Tickets por pagina quiero mostrar
    const itemPerPage = 5;

    // Find a Ticket, popular datos de los usuarios y paginar con mongoose paginate
    Ticket.find({ user: userId })
        .populate("user", "name -_id")
        .populate("client", "name -_id")
        .paginate(page, itemPerPage, async (error, tickets, total) => {
            if (error || !tickets) {
                return res.status(500).send({
                    status: "Error",
                    message: "No se ha podido realizar la consulta",
                })
            }
            // Listado de tickets user Logueado
            return res.status(200).send({
                status: "Success",
                message: "Listado de tickets que creo el usuario logueado",
                tickets,
                total,
                pages: Math.ceil(total / itemPerPage)
            });

        })
}

// Accion listado de tickets por estado
const getTickets = (req, res) => {
    // Funcion para obtener una lista de tickets.
    const { status } = req.query;

    // Comprobar si me llega la pagina, si no la pagina 1
    let page = 1;

    if (req.params.page) page = req.params.page

    // Tickets por pagina quiero mostrar
    const itemPerPage = 7;

    if (status === undefined) {
        Ticket.find()
            .populate("user", "name -_id")
            .populate("client","name -_id")
            .populate("department", "name -_id")
            .paginate(page, itemPerPage, async (error, tickets, total) => {
                if (error || !tickets) {
                    return res.status(404).send({
                        status: "Error",
                        message: "No se ha podido realizar la consulta",
                    })
                }
                // Listado de tickets user Logueado
                return res.status(200).send({
                    status: "Success",
                    message: "Listado de tickets",
                    tickets,
                    total,
                    pages: Math.ceil(total / itemPerPage)
                });

            })
    } else {
        Ticket.find({ status })
            .populate("user", "name -_id")
            .populate("department", "name -_id")
            .populate("client", "name -_id")
            .paginate(page, itemPerPage, async (error, tickets, total) => {
                if (error || !tickets) {
                    return res.status(404).send({
                        status: "Error",
                        message: "No se ha podido realizar la consulta",
                    })
                }
                // Listado de tickets user Logueado
                return res.status(200).send({
                    status: "Success",
                    message: "Listado de tickets abiertos",
                    tickets,
                    total,
                    pages: Math.ceil(total / itemPerPage)
                });
            })
    }
}

// Modificar ticket por ID
const updateTicket = (req, res) => {
    // Recoger informacion del usuario a Actualizar
    const { id } = req.params;
    const ticket = req.body;

    // Buscar y actualizar el ticket con la nueva info
    Ticket.findByIdAndUpdate({ _id: id }, ticket, (error, ticketToUpdate) => {

        if (error || !ticketToUpdate) {
            return res.status(500).json({
                status: "Error",
                message: "Error al actualizar el ticket"
            })
        }
        return res.status(200).send({
            status: "success",
            message: "Metodo de actualizar Ticket",
            ticket: ticketToUpdate
        })
    })
};

// Perfil de ticket
const profile = (req, res) => {

    //Recibir parametro de ID por la URL
    const id = req.params.id;

    // Consulta para sacar los datos del cliente
    Ticket.findById(id)
        .populate("client", "name -_id")
        .populate("user", "name -_id")
        .exec((error, ticketProfile) => {
            if (error || !ticketProfile) {
                return res.status(404).send({
                    status: "Error",
                    message: "El ticket no existe o hay un error"
                })
            }
            // Devolver resultado
            return res.status(200).send({
                status: "success",
                ticket: ticketProfile
            })
        })
}

// Eliminar ticket
const ticketDelete = (req, res) => {
    const { id } = req.params;

    Ticket.findByIdAndDelete(id, (error) => {
        if (error) { res.status(400).send({ msg: "No se pudo borrar el ticket." }) }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Ticket borrado correctamente",
        });
    })
}


// Exportar Acciones
module.exports = {
    pruebaTicket,
    save,
    listMyTickets,
    getTickets,
    updateTicket,
    ticketDelete,
    profile
}