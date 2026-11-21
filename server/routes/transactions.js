import { Router } from 'express';
import Transaction from '../models/Transaction.js';

const r = Router();
const wrap = (fn) => (req, res) => fn(req, res).catch((e) => res.status(400).json({ error: e.message }));

r.get('/', wrap(async (_req, res) => res.json(await Transaction.find().sort({ date: -1 }))));
r.post('/', wrap(async (req, res) => res.status(201).json(await Transaction.create(req.body))));
r.delete('/:id', wrap(async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

export default r;
