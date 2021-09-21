const mongoose = require('mongoose');

const RatingResuiltSchema = new mongoose.Schema({
  nameTest: {
    type: String,
    required: true,
  },
  _idTest:{
    type: String,
    required: true,
  },
  maker: {
    type: String,
    required: true,
  },
  point: {
    type: String,
    required: true
  },
  time:{
      type: String,
      required:  true
  },
  star:{
      type: String,
      required: true
  },
  isComplete:[

  ],
  isCorrect:[

  ],
  percentComplete:{
      type: String,
      required: true
  },
  createAt: {
      type: Date,
      default: Date.now
  }
});

const RatingResuilt = mongoose.model(
  'Rating&Resuilt',
  RatingResuiltSchema,
  'Rating&Resuilts'
);
module.exports = RatingResuilt;
