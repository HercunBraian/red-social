const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

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
            type: Schema.ObjectId,
            ref: "Department"
        },
        title:{
            type: String,
            required: true,
        },
        obs:{
            type: String,
            required: true
        },
        status: Boolean,
        priority:{
            type: Number,
            required: true
        },
        created_at:{
            type: Date,
            default: Date.now
        }
    }
);
TicketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Ticket", TicketSchema)