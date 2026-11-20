import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../components/usePaged';
import Pager from '../components/Pager';

const empty = { title: '', content: '' };

export default function NotesPage() {
  const { data, meta, page, setPage, reload, error } = usePaged('/notes');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  async function save(e) {
    e.preventDefault();
    setFormError('');
    try {
      if (editingId) {
        await api(`/notes/${editingId}`, { method: 'PATCH', body: form });
      } else {
        await api('/notes', { method: 'POST', body: form });
      }
      setForm(empty);
      setEditingId(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  function startEdit(note) {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content });
  }

  async function remove(id) {
    if (!confirm('Delete this note?')) return;
    await api(`/notes/${id}`, { method: 'DELETE' });
    reload();
  }

  return (
    <div>
      <form className="card" onSubmit={save}>
        <h3>{editingId ? 'Edit note' : 'New note'}</h3>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea
          placeholder="Write something..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        {formError && <p className="error">{formError}</p>}
        <div className="row">
          <button type="submit">{editingId ? 'Update' : 'Add'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>My notes</h3>
      {error && <p className="error">{error}</p>}
      {data.length === 0 && <p className="muted">No notes yet.</p>}
      {data.map((note) => (
        <div className="card" key={note._id}>
          <strong>{note.title}</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
          <div className="row">
            <span className="muted">{new Date(note.updatedAt).toLocaleString()}</span>
            <button onClick={() => startEdit(note)}>Edit</button>
            <button className="danger" onClick={() => remove(note._id)}>Delete</button>
          </div>
        </div>
      ))}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
