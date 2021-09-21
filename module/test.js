const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');


const TestSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    },
    diem: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    questions: [],
    totalQuestion:{
        type: String,
        required: true
    },
    examYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamYear"
    },
}
)

const Test = mongoose.model("Test", TestSchema, "Tests");
module.exports = Test;