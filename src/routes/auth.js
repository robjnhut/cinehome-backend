import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const accessToken = signAccess({ id: user._id, role: user.role, name: user.name });
  const refreshToken = signRefresh({ id: user._id });

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken, refreshToken
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccess({ id: user._id, role: user.role, name: user.name });
  const refreshToken = signRefresh({ id: user._id });

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken, refreshToken
  });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
  try {
    const payload = verifyRefresh(refreshToken);
    const accessToken = signAccess({ id: payload.id });
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = verifyRefresh(token) // thử như refresh? -> dùng access:
    // sửa: access verify
  } catch {}
});

export default router;
