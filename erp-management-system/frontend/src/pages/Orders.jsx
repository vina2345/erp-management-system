import { useEffect, useState } from 'react';
import { api, money } from '../api.js';

const STATUSES = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const emptyLine = () => ({ productId: '', quantity: 1 });

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [lines, setLines] = useState([emptyLine()]);

  const load = async () => {
    try {
      const [o, c, p] = await Promise.all([api.get('/orders'), api.get('/customers'), api.get('/products')]);
      setOrders(o.slice().sort((a, b) => b.id - a.id));
      setCustomers(c);
      setProducts(p);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => { load(); }, []);

  const productOf = (id) => products.find((p) => p.id === Number(id));
  const lineTotal = (l) => (productOf(l.productId)?.price ?? 0) * (Number(l.quantity) || 0);
  const preview = lines.reduce((sum, l) => sum + lineTotal(l), 0);

  const setLine = (i, patch) => setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const openForm = () => {
    setCustomerId('');
    setLines([emptyLine()]);
    setError('');
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const items = lines
      .filter((l) => l.productId)
      .map((l) => ({ productId: Number(l.productId), quantity: Number(l.quantity) }));
    if (!customerId || items.length === 0) {
      setError('Choose a customer and at least one product');
      return;
    }
    try {
      await api.post('/orders', { customerId: Number(customerId), items });
      setOpen(false);
      setError('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status?status=${status}`);
      setError('');
      load();
    } catch (err) {
      setError(err.message);
      load();
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1>Sales Orders</h1>
        <button className="btn primary" onClick={openForm}>+ New Order</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <table>
        <thead>
          <tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer?.name}</td>
              <td>{o.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}</td>
              <td>{money(o.totalAmount)}</td>
              <td>{o.orderDate ? new Date(o.orderDate).toLocaleString() : ''}</td>
              <td>
                <select
                  className={'status ' + o.status.toLowerCase()}
                  value={o.status}
                  disabled={o.status === 'CANCELLED'}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan="6" className="empty">No orders yet</td></tr>}
        </tbody>
      </table>

      {open && (
        <div className="modal-bg" onClick={() => setOpen(false)}>
          <form className="modal wide" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h3>New Sales Order</h3>
            {error && <div className="alert">{error}</div>}

            <label>
              Customer *
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">-- select --</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <div className="lines">
              {lines.map((l, i) => (
                <div className="line" key={i}>
                  <select value={l.productId} onChange={(e) => setLine(i, { productId: e.target.value })}>
                    <option value="">-- product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({money(p.price)}, stock {p.stockQuantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={l.quantity}
                    onChange={(e) => setLine(i, { quantity: e.target.value })}
                  />
                  <span className="line-total">{money(lineTotal(l))}</span>
                  {lines.length > 1 && (
                    <button type="button" className="btn danger" onClick={() => setLines(lines.filter((_, x) => x !== i))}>
                      X
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn" onClick={() => setLines([...lines, emptyLine()])}>
                + Add item
              </button>
            </div>

            <p className="total">Order total: <strong>{money(preview)}</strong></p>

            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn primary">Place Order</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
