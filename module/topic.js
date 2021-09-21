const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // bat buoc phai co giong nhu k cho null trong sql
  },
  image: {
    type: String,
    required: true,
  },
  ExamTest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamTest',
    },
  ],
  ExamYear: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamYear',
    },
  ],
  Questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  creater: {
    type: String,
    required: true,
  },
  createAt:{
      type: Date,
      default: Date.now
  }
});

const Topic = mongoose.model('Topic', TopicSchema, 'Topics');
module.exports = Topic;
