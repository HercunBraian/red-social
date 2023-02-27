const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const DepartmentSchema = mongoose.Schema({
    name: String
});

DepartmentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Department", DepartmentSchema);