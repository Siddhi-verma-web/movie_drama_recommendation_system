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

const PER_COUNTRY = 20;
const IMG = 'https://image.tmdb.org/t/p/w500';

async function seedTitle(id, country) {
  const [d, credits, prov] = await Promise.all([
    api.get(`/tv/${id}`),
    api.get(`/tv/${id}/credits`),
    api.get(`/tv/${id}/watch/providers`)
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
      {
        name: c.name,
        tmdbId: c.id,
        photo: c.profile_path ? IMG + c.profile_path : ''
      },
      { upsert: true, new: true }
    );
    actorIds.push(actor._id);
  }

  const drama = await Drama.findOneAndUpdate(
    { tmdbId: id },
    {
      tmdbId: id,
      title: t.name,
      country,
      overview: t.overview,
      poster: t.poster_path ? IMG + t.poster_path : '',
      genre: t.genres.map(g => g.name),
      releaseYear: t.first_air_date ? Number(t.first_air_date.slice(0, 4)) : null,
      episodeCount: t.number_of_episodes,
      avgRating: Math.round((t.vote_average || 0) * 10) / 10,
      platforms,
      cast: actorIds
    },
    { upsert: true, new: true }
  );

  await Actor.updateMany(
    { _id: { $in: actorIds } },
    { $addToSet: { dramas: drama._id } }
  );
  console.log(`  + ${t.name}`);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  for (const [country, code] of Object.entries(COUNTRIES)) {
    console.log(`\n${country}`);
    const res = await api.get('/discover/tv', {
      params: {
        with_origin_country: code,
        with_genres: 18,
        sort_by: 'popularity.desc'
      }
    });
    const list = res.data.results.slice(0, PER_COUNTRY);
    if (list.length === 0) console.log('  (TMDB mein kuch nahi mila, manual add karna)');
    for (const item of list) {
      try { await seedTitle(item.id, country); }
      catch (e) { console.log(`  x ${item.name}: ${e.message}`); }
    }
  }

  console.log('\nDone!');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });