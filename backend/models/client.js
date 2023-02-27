const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const ClientSchema = mongoose.Schema (
    {
        name:{
            type: String,
            required: true,
            unique: true
        },
        direccion:{
            type: String, 
            required: true
        },
        email:{
            type: String,
            required: true
        },
        phone: String,
        created_at:{
            type: Date,
            default: Date.now
        }
    }
);
ClientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Client", ClientSchema)