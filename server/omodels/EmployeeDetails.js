// models/EmployeeDetails.js
const mongoose = require('mongoose');

const employeeDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    courses: { type: [String], required: true },
    image: { type: String, required: true } // assuming storing image path
});

const EmployeeDetailsModel = mongoose.model('EmployeeDetails', employeeDetailsSchema);

module.exports = EmployeeDetailsModel;
