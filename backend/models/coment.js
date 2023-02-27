const { Schema, model } = require("mongoose");

const ComentSchema = Schema(
    {
        ticket: {
            type: Schema.ObjectId,
            ref: "Ticket",
        },
        user: {
            type: Schema.ObjectId,
            ref: "User",
        },
        text: {
            type: String,
            required: true,
        },
        isUpdated: {
            type: Boolean,
            default: false
        },
        file: String,
        created_at: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("Coment", ComentSchema, "coments")