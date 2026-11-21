import { inr } from '../utils.js';

export default function TransactionList({ items, onDelete }) {
  if (!items.length) return <p className="empty">Nothing recorded for this month. Add your income and rent to start.</p>;
  return (
    <div className="scroll">
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Type</th><th>Amount</th><th /></tr></thead>
        <tbody>
          {items.map((t) => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.category}</td>
              <td><span className={`tag ${t.recurring ? 'fixed' : ''}`}>{t.recurring ? 'Monthly' : 'One-off'}</span></td>
              <td className={t.type === 'income' ? 'pos' : ''}>{t.type === 'income' ? '+' : '−'}{inr(t.amount)}</td>
              <td>
                <button className="ghost" aria-label={`Delete ${t.title}`}
                  onClick={() => (!t.recurring || confirm('This removes the item from every month. Continue?')) && onDelete(t._id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
