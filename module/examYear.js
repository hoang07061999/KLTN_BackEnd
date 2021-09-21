const mongoose = require("mongoose")



const ExamYearSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // bat buoc phai co giong nhu k cho null trong sql
    },
    tests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test"
        }
    ],
    Topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }
},
)

const ExamYear = mongoose.model("ExamYear", ExamYearSchema, "ExamYears");
module.exports = ExamYear;