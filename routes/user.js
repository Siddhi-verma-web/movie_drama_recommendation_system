const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/me', auth, async (req, res) => {
  res.json(await User.findById(req.userId).select('-password')
    .populate('watchlist').populate('watched.drama'));
});

router.post('/watchlist/:dramaId', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, { $addToSet: { watchlist: req.params.dramaId } });
  res.json({ ok: true });
});

router.delete('/watchlist/:dramaId', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, { $pull: { watchlist: req.params.dramaId } });
  res.json({ ok: true });
});

router.post('/watched/:dramaId', auth, async (req, res) => {
  const { rating } = req.body;
  await User.findByIdAndUpdate(req.userId, {
    $pull: { watchlist: req.params.dramaId, watched: { drama: req.params.dramaId } }
  });
  await User.findByIdAndUpdate(req.userId, {
    $push: { watched: { drama: req.params.dramaId, userRating: rating } }
  });
  res.json({ ok: true });
});

module.exports = router;