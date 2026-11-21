import mongoose from 'mongoose';

// recurring=true -> fixed monthly item (rent, salary). false -> one-off (variable).
const schema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Other', trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', schema);
