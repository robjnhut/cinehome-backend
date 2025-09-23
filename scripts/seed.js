import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../src/models/Movie.js';
dotenv.config({ path: './.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Movie.deleteMany({});
  await Movie.insertMany([
    { title: 'Inception', durationMin: 148, status: 'showing', description: 'Dream heist' },
    { title: 'Interstellar', durationMin: 169, status: 'coming', description: 'Space & time' }
  ]);
  console.log('✅ Seeded movies');
  await mongoose.disconnect();
};
run().catch(e => { console.error(e); process.exit(1); });
