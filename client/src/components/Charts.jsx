import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { inr, monthLabel, PALETTE } from '../utils.js';

const tick = { fill: 'var(--muted)', fontSize: 12 };
const tip = { contentStyle: { background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--text)' }, formatter: (v) => inr(v), cursor: { fill: 'var(--soft)' } };
const k = (v) => (v >= 1000 ? `${v / 1000}k` : v);

export function Trend({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data.map((d) => ({ ...d, name: monthLabel(d.month) }))} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
        <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={k} width={40} />
        <Tooltip {...tip} />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#1fb141" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expense" name="Expenses" fill="#5b63ff" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data }) {
  if (!data.length) return <p className="empty">No expenses this month yet.</p>;
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div className="donut">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3} cornerRadius={6} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip {...tip} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="legend">
        {data.map((d, i) => (
          <li key={d.name}>
            <i style={{ background: PALETTE[i % PALETTE.length] }} />
            <span>{d.name}</span>
            <b>{inr(d.value)}</b>
            <em>{Math.round((d.value / total) * 100)}%</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Compare({ a, b, labelA, labelB }) {
  const names = [...new Set([...a, ...b].map((d) => d.name))];
  const get = (arr, n) => arr.find((d) => d.name === n)?.value || 0;
  const data = names.map((n) => ({ name: n, [labelB]: get(b, n), [labelA]: get(a, n) }));
  if (!data.length) return <p className="empty">No expenses in either month.</p>;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
        <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={k} width={40} />
        <Tooltip {...tip} />
        <Legend />
        <Bar dataKey={labelB} fill="#c4c8ff" radius={[8, 8, 0, 0]} />
        <Bar dataKey={labelA} fill="#5b63ff" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
