import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  durationMin: Number,
  posterUrl: String,
  status: { type: String, enum: ['coming', 'showing'], default: 'showing' }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
