const mongoose = require("mongoose");

const connection = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect("mongodb://127.0.0.1:27017/redsocial");

        console.log("Conectado correctamente a la base de datos");

    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectarse a la base de datos")        
    }
}

module.exports = connection