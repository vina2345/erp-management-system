import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Products from './pages/Products.jsx';
import Departments from './pages/Departments.jsx';
import Employees from './pages/Employees.jsx';
import Orders from './pages/Orders.jsx';

const links = [
  ['/', 'Dashboard'],
  ['/orders', 'Sales Orders'],
  ['/customers', 'Customers'],
  ['/products', 'Inventory'],
  ['/employees', 'Employees'],
  ['/departments', 'Departments'],
];

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>ERP System</h2>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </main>
    </div>
  );
}
