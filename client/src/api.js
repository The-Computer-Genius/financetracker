const call = async (url, opts) => {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
};
export const getTransactions = () => call('/api/transactions');
export const addTransaction = (body) => call('/api/transactions', { method: 'POST', body: JSON.stringify(body) });
export const deleteTransaction = (id) => call(`/api/transactions/${id}`, { method: 'DELETE' });
