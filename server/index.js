import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import transactions from './routes/transactions.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactions);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API on port', process.env.PORT || 5000)))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
