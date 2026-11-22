require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

require('./models/Actor');
require('./models/Drama');
require('./models/User');

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dramas', require('./routes/dramas'));
app.use('/api/user', require('./routes/user'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port 5000'));
  })
  .catch(err => console.error('DB error:', err.message));