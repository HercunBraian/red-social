const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const shortid = require('shortid');



const TicketSchema = mongoose.Schema (
    {
        client:{
            type: Schema.ObjectId,
            ref: "Client"
        },
        user:{
            type: Schema.ObjectId,
            ref: "User"
        },
        department:{
            type: String,
        },
        title:{
            type: String,
        },
        obs:{
            type: String,
        },
        diagnostic:{
            type: String,
        },
        inventario: [String],
        status:{
            type: String,
        },
        priority:{
            type: String,
        },
        visit:{
            type: String,
        },
        trackingId: { type: String, unique: true, default: shortid.generate },
        created_at:{
            type: Date,
            default: Date.now
        }
        
    }
);
TicketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Ticket", TicketSchema)