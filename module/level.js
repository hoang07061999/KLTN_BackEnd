const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  easily: {
    type: String,
    required: true,
  },
  normal: {
    type: String,
    required: true,
  },
  hard: {
    type: String,
    required: true,
  },
  creater: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Level = mongoose.model('Level', LevelSchema, 'Levels');
module.exports = Level;
