import { useEffect, useState } from 'react';
import { api } from '../api.js';

/**
 * Reusable list + add/edit/delete page.
 * columns: [{ label, render: (row) => node }]
 * fields:  [{ name, label, type, required, optionsFrom, optionLabel }]  (type 'select' = foreign key)
 */
export default function CrudPage({ title, endpoint, columns, fields }) {
  const [rows, setRows] = useState([]);
  const [options, setOptions] = useState({});
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setRows(await api.get(endpoint));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    fields
      .filter((f) => f.type === 'select')
      .forEach(async (f) => {
        try {
          const data = await api.get(f.optionsFrom);
          setOptions((o) => ({ ...o, [f.name]: data }));
        } catch (e) {
          setError(e.message);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const openNew = () => {
    setEditingId(null);
    setForm(Object.fromEntries(fields.map((f) => [f.name, ''])));
    setError('');
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm(
      Object.fromEntries(
        fields.map((f) => [f.name, f.type === 'select' ? row[f.name]?.id ?? '' : row[f.name] ?? ''])
      )
    );
    setError('');
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {};
    fields.forEach((f) => {
      const v = form[f.name];
      if (v === '' || v === null) payload[f.name] = null;
      else if (f.type === 'select') payload[f.name] = { id: Number(v) };
      else if (f.type === 'number') payload[f.name] = Number(v);
      else payload[f.name] = v;
    });
    try {
      if (editingId) await api.put(`${endpoint}/${editingId}`, payload);
      else await api.post(endpoint, payload);
      setForm(null);
      setError('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.del(`${endpoint}/${row.id}`);
      setError('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1>{title}</h1>
        <button className="btn primary" onClick={openNew}>+ Add New</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            {columns.map((c) => <th key={c.label}>{c.label}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              {columns.map((c) => <td key={c.label}>{c.render(r)}</td>)}
              <td className="actions">
                <button className="btn" onClick={() => openEdit(r)}>Edit</button>
                <button className="btn danger" onClick={() => remove(r)}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + 2} className="empty">No records yet</td></tr>
          )}
        </tbody>
      </table>

      {form && (
        <div className="modal-bg" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editingId ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</h3>
            {error && <div className="alert">{error}</div>}
            {fields.map((f) => (
              <label key={f.name}>
                {f.label}{f.required && ' *'}
                {f.type === 'select' ? (
                  <select
                    value={form[f.name]}
                    required={f.required}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  >
                    <option value="">-- select --</option>
                    {(options[f.name] || []).map((o) => (
                      <option key={o.id} value={o.id}>{o[f.optionLabel]}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || 'text'}
                    step={f.type === 'number' ? 'any' : undefined}
                    value={form[f.name]}
                    required={f.required}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                )}
              </label>
            ))}
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setForm(null)}>Cancel</button>
              <button type="submit" className="btn primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
