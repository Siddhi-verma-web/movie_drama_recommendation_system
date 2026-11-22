require('dotenv').config();
const mongoose = require('mongoose');
const Drama = require('./models/Drama');
const manual = require('./manual.json');

// manual list mein na hone wale titles ke liye genre se default mood
const MOOD = {
  Romance: ['Romantic'], Comedy: ['Light-hearted'], Drama: ['Emotional'],
  'Crime': ['Intense'], 'Action & Adventure': ['Thrilling'],
  'Sci-Fi & Fantasy': ['Fantasy'], Mystery: ['Suspense'], War: ['Epic']
};

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const m of manual) {
    const res = await Drama.findOneAndUpdate(
      { title: new RegExp('^' + esc(m.title) + '$', 'i') },
      { $set: m },
      { upsert: true, new: true }
    );
    console.log('manual:', res.title);
  }

  const all = await Drama.find({ $or: [{ moodTags: { $size: 0 } }, { moodTags: null }] });
  for (const d of all) {
    const moods = [...new Set(d.genre.flatMap(g => MOOD[g] || []))];
    d.moodTags = moods.length ? moods : ['Drama'];
    await d.save();
  }
  console.log('Default mood set for', all.length, 'dramas');
  process.exit(0);
}
run();