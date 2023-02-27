const {Schema, model} = require("mongoose");

const MachineSchema = Schema (
    {
        client: {
            type: Schema.ObjectId,
            ref: "Client",
            required: true
        },
        name:{
            type: String,
            required: true,
        },
        serial: String,
        model: String,
        ubi: String,
        version: String,
        created_at:{
            type: Date,
            default: Date.now
        }
    }
);

module.exports = model("Machine", MachineSchema, "machines")