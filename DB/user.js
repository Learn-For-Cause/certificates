const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    driveLink: {
        type: String,
        required: true
    }
});

var certificate = mongoose.model('certificate', certificateSchema);
module.exports = {
    certificate: certificate
}