import { useState } from 'react';
import { CATEGORIES } from '../utils.js';

const today = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ onAdd }) {
  const [f, setF] = useState({ type: 'expense', title: '', category: 'Rent', amount: '', date: today(), recurring: false });
  const [err, setErr] = useState('');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim() || !(Number(f.amount) > 0)) return setErr('Enter a name and an amount above 0.');
    try {
      await onAdd({ ...f, amount: Number(f.amount) });
      setErr('');
      setF((p) => ({ ...p, title: '', amount: '' }));
    } catch (x) { setErr(x.message); }
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="seg">
        {['expense', 'income'].map((t) => (
          <button type="button" key={t} className={f.type === t ? 'on' : ''}
            onClick={() => setF((p) => ({ ...p, type: t, category: CATEGORIES[t][0] }))}>
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>
      <label>Name<input value={f.title} onChange={(e) => set('title', e.target.value)} placeholder={f.type === 'income' ? 'Salary' : 'Flat rent'} /></label>
      <div className="row2">
        <label>Amount (₹)<input type="number" min="0" value={f.amount} onChange={(e) => set('amount', e.target.value)} /></label>
        <label>Date<input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} /></label>
      </div>
      <label>Category
        <select value={f.category} onChange={(e) => set('category', e.target.value)}>
          {CATEGORIES[f.type].map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="check">
        <input type="checkbox" checked={f.recurring} onChange={(e) => set('recurring', e.target.checked)} />
        Repeats every month (rent, bills, salary)
      </label>
      {err && <p className="err">{err}</p>}
      <button className="primary" type="submit">Add {f.type}</button>
    </form>
  );
}
