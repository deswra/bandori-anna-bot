const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  char: Number,
  content: String
});

module.exports = mongoose.model('Quote', quoteSchema);