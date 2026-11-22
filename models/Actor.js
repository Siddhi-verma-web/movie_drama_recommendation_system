const mongoose = require('mongoose');

module.exports = mongoose.model('Actor', new mongoose.Schema({
  name: String,
  photo: String,
  bio: String,
  tmdbId: Number,
  dramas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drama' }]
}));