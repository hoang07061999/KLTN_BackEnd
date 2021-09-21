const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  anwsers: [],
  level: {
    type: String,
    required: true,
  },
  Topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
  }
});

const Question = mongoose.model('Question', QuestionSchema, 'Questions');
module.exports = Question;
