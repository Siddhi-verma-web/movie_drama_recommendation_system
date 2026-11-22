require('dotenv').config();
const mongoose = require('mongoose');
const Drama = require('./models/Drama');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const total = await Drama.countDocuments();
  console.log('Total:', total);
  for (const c of ['India','Korea','China','Turkey','Philippines','Pakistan'])
    console.log(c, await Drama.countDocuments({ country: c }));
  const noPoster = await Drama.find({ $or: [{ poster: '' }, { poster: null }] }).select('title country');
  console.log('\nBina poster (manual-only, TMDB se match nahi hua):');
  noPoster.forEach(d => console.log(' -', d.title, '(' + d.country + ')'));
  process.exit(0);
})();