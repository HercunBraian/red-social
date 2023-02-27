// Importar dependencias y Modelos
const Machine = require("../models/machine");
const Client = require("../models/client");
const paginate = require("mongoose-pagination");

// Acciones de prueba
const pruebaMachine = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/machineController.js"
    });
}

// Crear Maquina
const addMachine = async (req, res) => {

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
}

// Obtener listado de maquinas con paginacion
const getMachines = (req, res) => {

    // Controlar en que pagina estamos
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    page = parseInt(page);

    // Consulta con mongoose pagination
    const itemPerPage = 3;

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
                status: "Success",
                message: "Listado de maquinas disponibles",
                machines,
                total,
                pages: Math.ceil(total / itemPerPage)
            });
        })

}

// Obtener perfil de maquina por ID
const getMachine = (req, res) => {
    // Recoger informacion de la maquina
    const { id } = req.params;

    // Buscar y actualizar el ticket con la nueva info
    Machine.findById({ _id: id }, (error, machine) => {

        if (error || !machine) {
            return res.status(500).json({
                status: "Error",
                message: "Error al buscar la maquina"
            })
        }

        Client.populate(machine, ("client"), function (err, perfilMachine) {
            // Listado de maquinas
            return res.status(200).send({
                status: "Success",
                message: "Perfil de maquina por ID",
                Perfil: perfilMachine
            });
        });
    })
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
module.exports = {
    pruebaMachine,
    addMachine,
    getMachines,
    getMachine,
    deleteMachine
}