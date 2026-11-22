const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drama' }],
  watched: [{
    drama: { type: mongoose.Schema.Types.ObjectId, ref: 'Drama' },
    userRating: Number,
    dateWatched: { type: Date, default: Date.now }
  }]
}));