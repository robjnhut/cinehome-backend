import { Router } from 'express';
import Movie from '../models/Movie.js';

const router = Router();

// GET /api/movies?status=showing
router.get('/', async (req, res) => {
  const q = {};
  if (req.query.status) q.status = req.query.status;
  const list = await Movie.find(q).sort('-createdAt').lean();
  res.json(list);
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  const doc = await Movie.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

// POST /api/movies
router.post('/', async (req, res) => {
  const doc = await Movie.create(req.body);
  res.status(201).json(doc);
});

// PUT /api/movies/:id
router.put('/:id', async (req, res) => {
  const doc = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

// DELETE /api/movies/:id
router.delete('/:id', async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
