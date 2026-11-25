import { useEffect, useState } from 'react';
import { api, money } from '../api.js';

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard').then(setD).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert">{error}</div>;
  if (!d) return <p>Loading...</p>;

  const cards = [
    ['Revenue', money(d.revenue)],
    ['Orders', d.orders],
    ['Customers', d.customers],
    ['Products', d.products],
    ['Employees', d.employees],
    ['Departments', d.departments],
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="cards">
        {cards.map(([label, value]) => (
          <div className="card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section>
          <h3>Low stock alerts</h3>
          <table>
            <thead><tr><th>Product</th><th>Stock</th><th>Reorder at</th></tr></thead>
            <tbody>
              {d.lowStock.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><span className="badge low">{p.stockQuantity}</span></td>
                  <td>{p.reorderLevel}</td>
                </tr>
              ))}
              {d.lowStock.length === 0 && <tr><td colSpan="3" className="empty">All stocked up</td></tr>}
            </tbody>
          </table>
        </section>

        <section>
          <h3>Recent orders</h3>
          <table>
            <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {d.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer?.name}</td>
                  <td>{money(o.totalAmount)}</td>
                  <td><span className={'badge ' + o.status.toLowerCase()}>{o.status}</span></td>
                </tr>
              ))}
              {d.recentOrders.length === 0 && <tr><td colSpan="4" className="empty">No orders yet</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
