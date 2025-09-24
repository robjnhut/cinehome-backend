// src/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Routers & middlewares của bạn
import moviesRouter from './routes/Movie.js';
import authRouter from './routes/auth.js';
import { ensureAuth, ensureRole } from './middlewares/auth.js';

const app = express();

// ⚠️ Nếu bạn dùng cookie/Authorization qua trình duyệt, KHÔNG dùng '*' với credentials:true.
// Đặt origin cụ thể từ env; nếu không cần credential thì đặt credentials:false.
const ALLOW_ORIGIN = process.env.WEBAPP_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: ALLOW_ORIGIN, credentials: true }));

app.use(express.json());

// Healthcheck (không phụ thuộc DB)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes của app
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

// Trang chủ demo
app.get('/', (req, res) => {
  res.send('Hello world!');
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối Mongo rồi mới start server (1 lần duy nhất)
async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('⚠️ Missing MONGO_URI env; server will start without DB connection.');
    } else {
      await mongoose.connect(MONGO_URI);
      console.log('✅ Connected to MongoDB');
    }

    app.listen(PORT, () => {
      console.log(`🚀 API ready on http://localhost:${PORT}`);
    });

    // Tắt mềm khi Render dừng container
    process.on('SIGTERM', async () => {
      console.log('⏹️ SIGTERM received. Closing...');
      await mongoose.connection.close().catch(() => {});
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1);
  }
}

start();
