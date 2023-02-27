// Importar dependencias y Modelos
const Coment = require("../models/coment");
const Ticket = require("../models/ticket");

// Acciones de prueba

const pruebaComent = (req, res) => {
    const params = req.body;
    console.log(params)
    return res.status(200).send({
        msg: "Mensaje enviado desde: controllers/comentController.js",
        params
    });
}

// Agregar comentario
const addComent = async (req, res) => {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId)

    if (ticket.user.toString() !== req.user.id) {
        res.status(404).send({
            status: "Error",
            msg: "Usuario no autorizado para agregar comentario."
        })
    }

    const coment = await Coment.create({
        text: req.body.text,
        ticket: ticketId,
        user: req.user.id
    })

    res.status(200).json(coment)
}

// Mostrar comentarios
const getComent = async (req, res) => {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId)

    if (ticket.user.toString() !== req.user.id) {
        res.status(401).send({
            status: "Error",
            msg: "Usuario no autorizado para ver los comentario."
        })
    }

    const notes = await Coment.find({ ticket: ticketId }).sort({ _id: -1 })
        .populate("user", "name -_id")

    res.status(200).json(notes)

}

// Modificar Comentario
const updateComent = async (req, res) => {
    // Recoger informacion del comentario a modificar
    const { id } = req.params;
    const coment = req.body;
    const comentComplete = await Coment.findById({_id: id}) 

    const ticketId = comentComplete.ticket;
    const ticket = await Ticket.findById(ticketId)

    if (ticket.user.toString() !== req.user.id) {
        return res.status(401).send({
            status: "Error",
            msg: "No estas autorizado para modificar el comentario"
        })
    }
  
    const comentToUpdate = { coment, isUpdated : true };
    if(coment) comentToUpdate.coment = coment;
    console.log(comentToUpdate) 
    // Buscar y actualizar el ticket con la nueva info
    Coment.findByIdAndUpdate({ _id: id },coment, { new: true }, (error, comentToUpdate) => {

        if (error || !comentToUpdate) {
            return res.status(500).json({
                status: "Error",
                message: "Error al modificar el comentario"
            })
        }
        return res.status(200).send({
            status: "success",
            message: "Metodo de modificar el comentario",
            coment: comentToUpdate
        })
    })
};

// Eliminar Comentario
const deleteComent = (req, res) => {
    // Sacar el id de la publicacion al sacar
    const comentId = req.params.id

    // Find de comentario
    Coment.find({ "user": req.user.id, "_id": comentId }).remove(error => {
        if (error) return res.status(500).send({
            status: "Error",
            msg: "Error al eliminar el comentario"
        })

        return res.status(200).send({
            status: "success",
            msg: "Comentario Eliminado",
            comentario: comentId
        })
    })
}

module.exports = {
    pruebaComent,
    addComent,
    getComent,
    deleteComent,
    updateComent
}