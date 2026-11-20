import { useState } from 'react';
import { api } from '../api';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function toggleMode(e) {
    e.preventDefault();
    setError('');
    setMode(mode === 'login' ? 'register' : 'login');
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const body = mode === 'login' ? { email: form.email, password: form.password } : form;
      const res = await api(`/auth/${mode}`, { method: 'POST', body });
      onAuth(res);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth card">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={submit}>
          {mode === 'register' && <input name="name" placeholder="Name" value={form.name} onChange={change} />}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} />
          {mode === 'register' && (
            <input name="interests" placeholder="Interests (comma separated)" value={form.interests} onChange={change} />
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
        </form>
        <p className="muted">
          {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
          <a href="#" onClick={toggleMode}>
            {mode === 'login' ? 'Register' : 'Login'}
          </a>
        </p>
      </div>
    </div>
  );
}
