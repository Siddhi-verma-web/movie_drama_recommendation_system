require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Drama = require('./models/Drama');
const Actor = require('./models/Actor');

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_KEY }
});

const COUNTRIES = {
  India: 'IN', Korea: 'KR', China: 'CN', Turkey: 'TR',
  Philippines: 'PH', Pakistan: 'PK'
};
const PER_COUNTRY = 12;
const IMG = 'https://image.tmdb.org/t/p/w500';

async function seedMovie(id, country) {
  const [d, credits, prov] = await Promise.all([
    api.get(`/movie/${id}`),
    api.get(`/movie/${id}/credits`),
    api.get(`/movie/${id}/watch/providers`)
  ]);
  const t = d.data;

  const region = prov.data.results.IN || prov.data.results.US || {};
  const platforms = (region.flatrate || []).map(p => ({
    name: p.provider_name,
    url: region.link
  }));

  const actorIds = [];
  for (const c of credits.data.cast.slice(0, 6)) {
    const actor = await Actor.findOneAndUpdate(
      { tmdbId: c.id },
      { name: c.name, tmdbId: c.id, photo: c.profile_path ? IMG + c.profile_path : '' },
      { upsert: true, returnDocument: 'after' }
    );
    actorIds.push(actor._id);
  }

  const movie = await Drama.findOneAndUpdate(
    { tmdbId: id, type: 'movie' },
    {
      tmdbId: id,
      type: 'movie',
      title: t.title,
      country,
      overview: t.overview,
      poster: t.poster_path ? IMG + t.poster_path : '',
      genre: t.genres.map(g => g.name),
      releaseYear: t.release_date ? Number(t.release_date.slice(0, 4)) : null,
      runtime: t.runtime,
      avgRating: Math.round((t.vote_average || 0) * 10) / 10,
      platforms,
      cast: actorIds
    },
    { upsert: true, returnDocument: 'after' }
  );

  await Actor.updateMany({ _id: { $in: actorIds } }, { $addToSet: { dramas: movie._id } });
  console.log('  + ' + t.title);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding movies...');

  for (const [country, code] of Object.entries(COUNTRIES)) {
    console.log('\n' + country);
    const res = await api.get('/discover/movie', {
      params: { with_origin_country: code, sort_by: 'popularity.desc', 'vote_count.gte': 20 }
    });
    const list = res.data.results.slice(0, PER_COUNTRY);
    if (!list.length) console.log('  (TMDB mein kuch nahi mila)');
    for (const item of list) {
      try { await seedMovie(item.id, country); }
      catch (e) { console.log('  x ' + item.title + ': ' + e.message); }
    }
  }

  console.log('\nDone!');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });