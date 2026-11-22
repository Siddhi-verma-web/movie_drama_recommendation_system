const router = require('express').Router();
const Drama = require('../models/Drama');

// List + filters: /api/dramas?country=Korea&genre=Romance&mood=Healing&trope=...&q=title&sort=rating
router.get('/', async (req, res) => {
  const { country, genre, mood, trope, q, sort } = req.query;
  const f = {};
  if (country) f.country = country;
  if (genre) f.genre = genre;
  if (mood) f.moodTags = mood;
  if (trope) f.tropes = trope;
  if (q) f.title = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const order = sort === 'rating' ? { avgRating: -1 } : { releaseYear: -1 };
  res.json(await Drama.find(f).sort(order).limit(100));
});

// Detail
router.get('/:id', async (req, res) => {
  try {
    const d = await Drama.findById(req.params.id).populate('cast');
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json(d);
  } catch { res.status(400).json({ error: 'Bad id' }); }
});

// Recommendations (Section 10.4 formula)
router.get('/:id/similar', async (req, res) => {
  try {
    const base = await Drama.findById(req.params.id);
    if (!base) return res.status(404).json({ error: 'Not found' });
    const common = (a = [], b = []) => a.filter(x => b.includes(x)).length;
    const baseCast = base.cast.map(String);
    const all = await Drama.find({ _id: { $ne: base._id } });
    const scored = all.map(d => ({
      drama: d,
      score: 2 * common(base.genre, d.genre) + 1.5 * common(base.moodTags, d.moodTags)
           + 3 * common(baseCast, d.cast.map(String)) + 2 * common(base.tropes, d.tropes)
    })).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
    res.json(scored);
  } catch { res.status(400).json({ error: 'Bad id' }); }
});

module.exports = router;