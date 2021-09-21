const mongoose = require("mongoose")

const ExamTestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    totalQuestion:{
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true,
    },
    diem: {
        type: String,
        required: true,
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }
    ],
    Topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }
},
)

const ExamTest = mongoose.model("ExamTest", ExamTestSchema, "ExamTests");
module.exports = ExamTest;