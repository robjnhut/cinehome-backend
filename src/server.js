import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import moviesRouter from './routes/Movie.js';
import authRouter from './routes/auth.js';
import { ensureAuth, ensureRole } from './middlewares/auth.js';

const app = express();
app.use(cors({ origin: process.env.WEBAPP_ORIGIN || '*', credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);

// ví dụ route bảo vệ:
app.get('/api/protected', ensureAuth, (req, res) => {
  res.json({ message: `Hello ${req.user?.name || 'user'}` });
});

// ví dụ route admin-only:
app.get('/api/admin-only', ensureAuth, ensureRole('admin'), (req, res) => {
  res.json({ secret: 'Only admin can see this' });
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 API ready: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connect error:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
