const mongoose = require('mongoose');

module.exports = mongoose.model('Drama', new mongoose.Schema({
  tmdbId: Number,
  title: { type: String, required: true },
  country: String,
  overview: String,
  poster: String,
  genre: [String],
  moodTags: [String],
  tropes: [String],
  releaseYear: Number,
  episodeCount: Number,
  avgRating: { type: Number, default: 0 },
  platforms: [{ name: String, url: String }],
  ost: [{ songTitle: String, artist: String, youtubeUrl: String }],
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }]
}));