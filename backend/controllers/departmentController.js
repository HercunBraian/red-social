// Importar dependencias y Modelos
const Department = require("../models/department");
const Ticket = require("../models/ticket");
const paginate = require("mongoose-pagination");

// Acciones de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/deparment"
    });
}

// Crear Departamento
const save = (req, res) => {

    const params = req.body;

    if (!params.name) {
        return res.status(400).send({
            status: "Error",
            msg: "Validacion incompleta"
        });
    }

    // Crear y rellenar el objeto del modelo
    let newDepartment = new Department(params);

    // Guardar objeto en BBDD
    newDepartment.save((error, departmentStored) => {
        if (error || !departmentStored) return res.status(400).send({
            status: "Error",
            msg: "No se ha creado el departamento"
        });

        // Devolver Repuesta
        return res.status(200).send({
            msg: "Department creado exitosamente",
            departmentStored
        });
    })

}

// Accion listado de departametos
const getDeparments = (req, res) => {
    // Funcion para obtener una lista de tickets.

    // Controlar en que pagina estamos
    const {page=1, limit=2} = req.query;
    const options = {
        page:parseInt(page),
        limit: parseInt(limit)
    };

    Department.paginate({}, options, (error, departments) => {

            if (error || !departments) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay departamentos disponibles",
                    error
                })
            }
            // Listado de maquinas
            return res.status(200).send({
                status: "Success",
                message: "Listado de deparamentos",
                departments
            });
        })
}

// Perfil de departamento
const profile = (req, res) => {

    //Recibir parametro de ID por la URL
    const id = req.params.id;

    // Consulta para sacar los datos del cliente
    Department.findById(id)
        .exec((error, departmentProfile) => {
            if (error || !departmentProfile) {
                return res.status(404).send({
                    status: "Error",
                    message: "El departamento no existe o hay un error"
                })
            }
            // Devolver resultado
            return res.status(200).send({
                status: "success",
                department: departmentProfile
            })
        })
}

// Modificar Departamento
const update = (req, res) => {
    const { id } = req.params;
    const departmentData = req.body;

    Department.findByIdAndUpdate({ _id: id }, departmentData, (error) => {
        if (error) {
            res.status(400).send({ msg: "Error al actualizar el departamento." })
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Departamento modificado correctamente",
            Update: departmentData
        });
    })
}

// Eliminar Departamento
const deleteDepartment = (req, res) => {
    const { id } = req.params;
    
    Department.findByIdAndDelete(id, (error) => {
        if (error) { res.status(400).send({ msg: "No se pudo borrar el departamento." }) }
        
        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Departamento borrado correctamente",
        });
    })
}

module.exports = {
    prueba,
    save,
    getDeparments,
    update,
    deleteDepartment,
    profile
}