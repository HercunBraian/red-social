const { Schema, model } = require("mongoose");

const TecnicoSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        rol: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }
);

module.exports = model("Tecnico", TecnicoSchema, "tecnicos")