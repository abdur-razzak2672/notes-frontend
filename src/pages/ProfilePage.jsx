import { useState } from 'react';
import { api } from '../api';

export default function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({ name: user.name, interests: user.interests.join(', '), password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function save(e) {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const body = { name: form.name, interests: form.interests };
      if (form.password) body.password = form.password;
      const res = await api('/users/me', { method: 'PATCH', body });
      onUpdate(res.user);
      setForm({ ...form, password: '' });
      setMsg('Profile updated');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={save}>
      <h3>My profile</h3>
      <p className="muted">{user.email}</p>
      <label>Name</label>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <label>Interests (comma separated)</label>
      <input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
      <label>New password (leave empty to keep current)</label>
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
