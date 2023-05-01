// importar Modelo
const Ticket = require("../models/ticket");
const User = require("../models/user");
const Client = require("../models/client")
const Department = require("../models/department");
const mongoosePaginate = require("mongoose-pagination");

// Acciones de prueba
const pruebaTicket = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/ticketControllers.js"
    });
}

// Crear ticket
const save2 = (req, res) => {

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

// Crear ticket
const save = async (req, res) => {

    // Conseguir datos del body
    const params = req.body;
    
    // Recoger el nombre del cliente asignar el ticket 
    const clientName = params.client;
    const userName = params.user;

/*     // Sacar id del usuario identificado
    const userLogin = req.user; */

    // Comprobar que me llegan bien + validacion
    if (!params.client || !params.title || !params.priority || !params.obs || !params.department || !params.user || !params.visit) {
        return res.status(400).json({
            message: "Validacion Incorrecta"
        });
    }

    // Luego buscamos el cliente
    Client.findOne({ name: clientName }, "_id", function (err, client) {
        if (err) throw err;
        console.log(client._id)

        // Buscar al usuario en la base de datos
        User.findOne({ name: userName }, "_id", function (err, user) {
            if (err) throw err;
            console.log(user._id)


        // Crear objeto con modelo ticket
        let newTicket = new Ticket({ ...req.body, client: client._id, user: user._id, status: "Pendiente" });

        newTicket.save((error, ticketStored) => {
            if (error || !ticketStored) {
                return res.status(500).send({
                    status: "Error",
                    message: "No se ha podido crear el ticket",
                })
            }

            return res.status(200).send({
                status: "Success",
                ticketStored
            })
        })
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
    const itemPerPage = 500;

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
    const itemPerPage = 10000000;

    if (status === undefined) {
        Ticket.find()
            .populate("user", "name -_id")
            .populate("client", "name -_id")
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
/* const updateTicket = async (req, res) => {
    const ticket = req.body;

    // Obtener el nombre del cliente desde el objeto `ticket`
    const clientName = ticket.client;    

    // Buscar el cliente por nombre
    const clientResult = await new Promise((resolve, reject) => {
        Client.findOne({ name: clientName }, "_id", function (error, client) {
            if (error || !client) {
                reject(new Error("No se ha podido encontrar el cliente"));
            } else {
                resolve(client);
            }
        });
    });

    // Incluir el `_id` del cliente y del departamento (si se especificó) en el objeto `ticket`
    ticket.client = clientResult._id;

    // Actualizar el ticket con el objeto `ticket` modificado
    Ticket.findByIdAndUpdate(
        req.params.id,
        ticket,
        { new: true },
        (err, ticketUpdated) => {
            if (err || !ticketUpdated) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error al actualizar el ticket",
                    ticket: ticket,
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Ticket actualizado correctamente",
                ticket: ticketUpdated,
            });
        }
    );
}; */

const updateTicket = async (req, res) => {
    const ticket = req.body;

    let updateData = {};

    if (ticket.client) {
        const clientResult = await new Promise((resolve, reject) => {
            Client.findOne({ name: ticket.client }, "_id", function (error, client) {
                if (error || !client) {
                    reject(new Error("No se ha podido encontrar el cliente"));
                } else {
                    resolve(client);
                }
            });
        });

        updateData.client = clientResult._id;
    }

    if (ticket.user) {
        const userResult = await new Promise((resolve, reject) => {
            User.findOne({ name: ticket.user }, "_id", function (error, user) {
                if (error || !user) {
                    reject(new Error("No se ha podido encontrar el usuario"));
                } else {
                    resolve(user);
                }
            });
        });

        updateData.user = userResult._id;
    }

    if (ticket.department) {
        updateData.department = ticket.department;
    }

    if (ticket.title) {
        updateData.title = ticket.title;
    }

    if (ticket.obs) {
        updateData.obs = ticket.obs;
    }

    if (ticket.diagnostic) {
        updateData.diagnostic = ticket.diagnostic;
    }

    if (ticket.status) {
        updateData.status = ticket.status;
    }

    if (ticket.priority) {
        updateData.priority = ticket.priority;
    }

    // Actualizar el ticket con los campos modificados
    Ticket.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
        (err, ticketUpdated) => {
            if (err || !ticketUpdated) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error al actualizar el ticket",
                    ticket: ticket,
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Ticket actualizado correctamente",
                ticket: ticketUpdated,
            });
        }
    );
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

// Contador de tickets Abiertos
const ticketCount = (req, res) => {
    Ticket.count((error, tickets) => {
        if(error){
            return res.status(400).send({
                status: "error",
                msg: error
            })
        } 

        return res.status(200).send({
            status: "success",
            message: "Contador de Tickets",
            tickets: tickets,
        });
    })
}

// Contador de tickets Cerrados
const ticketCountClose = (req, res) => {
    Ticket.count({ status: "Cerrado" }, (error, tickets) => {
        if(error){
            return res.status(400).send({
                status: "error",
                msg: error
            })
        } 

        return res.status(200).send({
            status: "success",
            message: "Contador de Tickets",
            tickets: tickets,
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
    profile,
    ticketCount,
    ticketCountClose

}