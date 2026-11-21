import { useEffect, useMemo, useState } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from './api.js';
import { entriesFor, totals, byCategory, lastMonths, mk, monthLabel, inr } from './utils.js';
import { Trend, Donut, Compare } from './components/Charts.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';

const Card = ({ title, children, className = '' }) => (
  <section className={`card ${className}`}><h2>{title}</h2>{children}</section>
);

export default function App() {
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const months = useMemo(() => lastMonths(12), []);
  const [month, setMonth] = useState(mk(new Date()));
  const [other, setOther] = useState(lastMonths(2)[0]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => { getTransactions().then(setTxs).catch(() => setError('Cannot reach the server. Is it running on port 5000?')); }, []);

  const add = async (body) => {
    const newTx = await addTransaction(body);
    setTxs((p) => [...p, newTx]);
  };
  const remove = async (id) => { await deleteTransaction(id); setTxs((p) => p.filter((t) => t._id !== id)); };

  const cur = entriesFor(txs, month);
  const t = totals(cur);
  const prev = totals(entriesFor(txs, lastMonths(2, new Date(month + '-02'))[0]));
  const diff = prev.expense ? Math.round(((t.expense - prev.expense) / prev.expense) * 100) : null;
  const trend = lastMonths(6, new Date(month + '-02')).map((m) => ({ month: m, ...totals(entriesFor(txs, m)) }));
  const cA = byCategory(cur), cB = byCategory(entriesFor(txs, other));
  const fixed = cur.filter((x) => x.type === 'expense' && x.recurring).reduce((a, x) => a + x.amount, 0);
  const MonthSelect = ({ value, onChange, label }) => (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {months.map((m) => <option key={m} value={m}>{monthLabel(m, true)}</option>)}
    </select>
  );

  return (
    <main>
      <header>
        <div><h1>Your money</h1><p>Income, bills and spending in one place</p></div>
        <div className="tools">
          <MonthSelect value={month} onChange={setMonth} label="Month" />
          <button className="ghost round" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark mode">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>
      {error && <p className="err banner">{error}</p>}

      <div className="stats">
        <div className="stat s1"><span>Income</span><b>{inr(t.income)}</b></div>
        <div className="stat s2"><span>Expenses</span><b>{inr(t.expense)}</b>
          {diff !== null && <small className={diff > 0 ? 'neg' : 'pos'}>{Math.abs(diff)}% {diff > 0 ? 'more' : 'less'} than last month</small>}</div>
        <div className="stat s3"><span>Saved</span><b>{inr(t.income - t.expense)}</b>
          <small>{t.income ? `${Math.round(((t.income - t.expense) / t.income) * 100)}% of income` : 'Add income to see this'}</small></div>
        <div className="stat s4"><span>Fixed bills</span><b>{inr(fixed)}</b>
          <small>{t.expense ? `${Math.round((fixed / t.expense) * 100)}% of spending` : 'Rent, electricity, etc.'}</small></div>
      </div>

      <div className="grid">
        <Card title="Last 6 months" className="wide"><Trend data={trend} /></Card>
        <Card title={`Where it went · ${monthLabel(month, true)}`}><Donut data={cA} /></Card>
        <Card title="Compare months" className="wide">
          <div className="cmp">
            <MonthSelect value={month} onChange={setMonth} label="Month A" /> <span>vs</span>
            <MonthSelect value={other} onChange={setOther} label="Month B" />
            <strong>{inr(totals(entriesFor(txs, month)).expense - totals(entriesFor(txs, other)).expense)} difference in spending</strong>
          </div>
          <Compare a={cA} b={cB} labelA={monthLabel(month, true)} labelB={monthLabel(other, true)} />
        </Card>
        <Card title="Add entry"><TransactionForm onAdd={add} /></Card>
        <Card title={`Entries · ${monthLabel(month, true)}`} className="full">
          <TransactionList items={cur} onDelete={remove} />
        </Card>
      </div>
    </main>
  );
}
