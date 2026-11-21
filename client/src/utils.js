export const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export const mk = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`;
};
export const monthLabel = (m, long) => {
  const [y, mo] = m.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleString('en-IN', long ? { month: 'long', year: 'numeric' } : { month: 'short' });
};
export const lastMonths = (n, from = new Date()) =>
  Array.from({ length: n }, (_, i) => mk(new Date(from.getFullYear(), from.getMonth() - (n - 1 - i), 1)));

// Recurring items count in every month from their start month onward; one-offs only in their own month.
export const entriesFor = (txs, m) =>
  (Array.isArray(txs) ? txs : []).filter((t) => (t.recurring ? mk(t.date) <= m : mk(t.date) === m));

export const totals = (es) =>
  es.reduce((a, t) => ((a[t.type] += t.amount), a), { income: 0, expense: 0 });

export const byCategory = (es) =>
  Object.entries(
    es.filter((t) => t.type === 'expense').reduce((a, t) => ((a[t.category] = (a[t.category] || 0) + t.amount), a), {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

export const CATEGORIES = {
  expense: ['Rent', 'Electricity', 'Water', 'Internet', 'Groceries', 'Food', 'Shopping', 'Travel', 'Subscriptions', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Interest', 'Other'],
};
export const PALETTE = ['#5b63ff', '#1fb141', '#ffbb1f', '#a855f7', '#ff7a45', '#22d3ee', '#ec4899', '#84cc16'];
