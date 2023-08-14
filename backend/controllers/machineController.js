// Importar dependencias y Modelos
const Machine = require("../models/machine");
const Client = require("../models/client");
const Ticket = require("../models/ticket");

// Acciones de prueba
const pruebaMachine = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/machineController.js"
    });
}

// Crear Maquina
/* const addMachine = async (req, res) => {

    // Recoger informacion del body
    const params = req.body;

    // Recoger el id del cliente asignar el ticket 
    const clientId = params.client;

    // Comprobar que me llegan bien + validacion
    if (!params.client || !params.name) {
        return res.status(400).json({
            message: "Validacion Incorrecta"
        });
    }

    let newMachine = new Machine({ ...req.body });
    // Guardar objeto en bbdd
    newMachine.save((error, machineStored) => {
        if (error || !machineStored) {
            return res.status(500).send({
                status: "Error",
                message: "No se ha podido crear la maquina correctamente",
            })
        }

        return res.status(200).send({
            status: "Success",
            machineStored
        })
    })
} */

// Crear Maquina
const addMachine = (req, res) => {
    // Conseguir datos del body
    const params = req.body;

    // Comprobar que me llegan bien + validacion
    if (!params.client || !params.name || !params.serial || !params.model || !params.version || !params.ubi) {
        return res.status(400).json({
            message: "Validacion Incorrecta"
        });
    }

    // Buscar el cliente por su id
    Client.findById(params.client, "_id", (err, client) => {
        if (err) {
            return res.status(500).json({
                status: "Error",
                message: "Error en la búsqueda del cliente en la base de datos",
            });
        }

        if (!client) {
            return res.status(404).json({
                status: "Error",
                message: "Cliente no encontrado en la base de datos",
            });
        }

        // Crear objeto con modelo Machine y asignar el id del cliente
        const newMachine = new Machine({ ...req.body, client: client._id });
        
        newMachine.save((error, machineStored) => {
            if (error || !machineStored) {
                return res.status(500).json({
                    status: "Error",
                    message: "No se ha podido crear la máquina",
                });
            }

            return res.status(200).json({
                status: "Success",
                machineStored
            });
        });
    });
}

// Contador de Repacaciones de Equipos
const getRepairCount = async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findById(id).populate("tickets");
        console.log(machine)
        if (!machine) {
            return res.status(404).json({ error: "Machine not found" });
        }

        const repairCount = machine.tickets.filter(
            (ticket) => ticket.visit === "REPARACION"
        ).length;

        res.status(200).json({ equipo: machine.name, reparaciones: repairCount });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Contador de Reparaciones del ultimo mes de todas las maquinas
const getLastMonthRepairCount = async (req, res) => {
    try {
        // Calcula la fecha de hace un mes desde la fecha actual
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // Busca los tickets que son reparaciones y se crearon en el último mes
        const repairCount = await Ticket.countDocuments({
            visit: "REPARACION",
            created_at: { $gte: lastMonth }
        });

        res.status(200).json({ reparacionesUltimoMes: repairCount });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Contador de Reparaciones del ultimo mes por Maquina
const getLastMonthRepairCountForMachine = async (req, res) => {
    try {
        const { id } = req.params;
        const machine = await Machine.findById(id);

        if (!machine) {
            return res.status(404).json({ error: "Machine not found" });
        }

        // Calcula la fecha de hace un mes desde la fecha actual
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // Busca los tickets relacionados con la máquina que son reparaciones y se crearon en el último mes
        const repairCount = await Ticket.countDocuments({
            _id: { $in: machine.tickets }, // Filtra por los IDs de tickets en la máquina
            visit: "REPARACION",
            created_at: { $gte: lastMonth }
        });

        res.status(200).json({ reparacionesUltimoMes: repairCount });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Contador de Reparaciones por Mes de todos los equipos
const getMonthlyRepairCounts = async (req, res) => {
    try {
        // Define una consulta para agrupar los tickets por mes y contar reparaciones
        const monthlyCounts = await Ticket.aggregate([
            {
                $match: { visit: "REPARACION" } // Filtra por reparaciones
            },
            {
                $group: {
                    _id: { $month: "$created_at" }, // Agrupa por mes
                    count: { $sum: 1 } // Cuenta la cantidad de tickets en cada grupo
                }
            }
        ]);

        res.status(200).json({ monthlyCounts });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


// Obtener listado de maquinas con paginacion
const getMachines = (req, res) => {

    // Controlar en que pagina estamos
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    page = parseInt(page);

    // Consulta con mongoose pagination
    const itemPerPage = 50;

    Machine.find().sort('_id')
        .populate("client", "name -_id")
        .paginate(page, itemPerPage, (error, machines, total) => {

            if (error || !machines) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay maquinas disponibles",
                    error
                })
            }
            // Listado de maquinas
            return res.status(200).send({
                status: "success",
                message: "Listado de maquinas disponibles",
                machines,
                total,
                pages: Math.ceil(total / itemPerPage)
            });
        })

}

// Obtener perfil de maquina por ID
const getMachine = (req, res) => {
    // Recoger información de la máquina
    const { id } = req.params;

    // Buscar la máquina por ID
    Machine.findById(id, (error, machine) => {
        if (error || !machine) {
            return res.status(404).json({
                status: "Error",
                message: "Máquina no encontrada"
            });
        }

        // Buscar los tickets que contengan el ID de la máquina en el campo 'inventario'
        Ticket.find({ inventario: machine._id })
            .populate("client", "name")
            .populate("user", "name")
            .exec((error, tickets) => {
                if (error) {
                    return res.status(500).json({
                        status: "Error",
                        message: "Error al buscar los tickets relacionados"
                    });
                }

            // Listado de máquina con los tickets relacionados
            const machineWithTickets = {
                ...machine._doc,
                tickets: tickets
            };

            return res.status(200).send({
                status: "Success",
                message: "Perfil de máquina por ID",
                perfil: machineWithTickets
            });
        });
    });
};



// Eliminar una maquina
const deleteMachine = (req, res) => {
    const { id } = req.params;

    Machine.findByIdAndDelete(id, (error, machine) => {

        if (error) { res.status(400).send({ msg: "No se pudo borrar la maquina." }) }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Maquina borrada correctamente",
            machine
        });

    })
}

// Funcion para obtener una lista de clientes.
const list = (req, res) => {
    // Controlar en que pagina estamos
    const { page = 1, limit = 10 } = req.query;
  
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: "_id",
    };
  
    Machine.paginate({}, options, (error, machines) => {
      if (error || !machines) {
        return res.status(404).send({
          status: "error",
          message: "No hay maquinas disponibles",
          error,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Ruta de listado de Clientes",
        machines,
      });
    });
  
    // Devolver Resultado posteriormente info de Follows
  };
module.exports = {
    pruebaMachine,
    addMachine,
    getMachines,
    getMachine,
    deleteMachine,
    list,
    getRepairCount,
    getLastMonthRepairCount,
    getLastMonthRepairCountForMachine,
    getMonthlyRepairCounts
}