import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../components/usePaged';
import Pager from '../components/Pager';

function UserPosts({ userId, onBack }) {
  const { data, meta, page, setPage, error, user } = usePaged(`/posts/user/${userId}`, 5);

  return (
    <div>
      <button onClick={onBack}>Back to all posts</button>
      {error && <p className="error">{error}</p>}
      {user && (
        <h3>
          Posts by {user.name}{' '}
          {user.interests.map((i) => (
            <span className="tag" key={i}>{i}</span>
          ))}
        </h3>
      )}
      {data.length === 0 && <p className="muted">This user has no posts.</p>}
      {data.map((post) => (
        <div className="card" key={post._id}>
          <strong>{post.title}</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
          <span className="muted">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      ))}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}

export default function PostsPage({ me }) {
  const { data, meta, page, setPage, reload, error } = usePaged('/posts');
  const [form, setForm] = useState({ title: '', body: '' });
  const [formError, setFormError] = useState('');
  const [viewUser, setViewUser] = useState(null);

  async function create(e) {
    e.preventDefault();
    setFormError('');
    try {
      await api('/posts', { method: 'POST', body: form });
      setForm({ title: '', body: '' });
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this post?')) return;
    await api(`/posts/${id}`, { method: 'DELETE' });
    reload();
  }

  if (viewUser) return <UserPosts userId={viewUser} onBack={() => setViewUser(null)} />;

  return (
    <div>
      <form className="card" onSubmit={create}>
        <h3>Write a post</h3>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        {formError && <p className="error">{formError}</p>}
        <button type="submit">Publish</button>
      </form>

      <div className="row">
        <h3>All posts</h3>
        <button onClick={() => setViewUser(me._id)}>My posts</button>
      </div>
      {error && <p className="error">{error}</p>}
      {data.map((post) => (
        <div className="card" key={post._id}>
          <strong>{post.title}</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
          <div className="row">
            <span className="muted">
              by{' '}
              {post.author ? (
                <a href="#" onClick={() => setViewUser(post.author._id)}>{post.author.name}</a>
              ) : (
                'deleted user'
              )}{' '}
              · {new Date(post.createdAt).toLocaleString()}
            </span>
            {(post.author?._id === me._id || me.role === 'admin') && (
              <button className="danger" onClick={() => remove(post._id)}>Delete</button>
            )}
          </div>
        </div>
      ))}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
