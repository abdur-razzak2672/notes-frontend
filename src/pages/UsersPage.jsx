import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../components/usePaged';
import Pager from '../components/Pager';

const empty = { name: '', email: '', password: '', role: 'user', interests: '' };

export default function UsersPage({ me }) {
  const { data, meta, page, setPage, reload, error } = usePaged('/users');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setFormError('');
    try {
      const body = { ...form };
      if (editingId && !body.password) delete body.password;
      if (editingId) {
        await api(`/users/${editingId}`, { method: 'PATCH', body });
      } else {
        await api('/users', { method: 'POST', body });
      }
      setForm(empty);
      setEditingId(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  function startEdit(u) {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') });
  }

  async function remove(u) {
    if (!confirm(`Delete ${u.name}? Their notes and posts will be removed too.`)) return;
    try {
      await api(`/users/${u._id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <form className="card" onSubmit={save}>
        <h3>{editingId ? 'Edit user' : 'Add user'}</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={change} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input
          name="password"
          type="password"
          placeholder={editingId ? 'New password (optional)' : 'Password'}
          value={form.password}
          onChange={change}
        />
        <input name="interests" placeholder="Interests (comma separated)" value={form.interests} onChange={change} />
        <select name="role" value={form.role} onChange={change}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        {formError && <p className="error">{formError}</p>}
        <div className="row">
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Interests</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                <td>{u.interests.map((i) => <span className="tag" key={i}>{i}</span>)}</td>
                <td>
                  <div className="row">
                    <button onClick={() => startEdit(u)}>Edit</button>
                    {u._id !== me._id && (
                      <button className="danger" onClick={() => remove(u)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
