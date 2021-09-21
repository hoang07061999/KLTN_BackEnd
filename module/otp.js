const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required:  true,
    },
    OTP: {
        type: String,
        required: true,
    },
},
    { versionKey: false }
)

const OTP = mongoose.model("OPT", OTPSchema, "OTPs");
module.exports = OTP;