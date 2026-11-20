import { useState } from 'react';
import { usePaged } from '../components/usePaged';
import Pager from '../components/Pager';

export default function AllNotesPage() {
  const [userFilter, setUserFilter] = useState('');
  const path = userFilter ? `/notes/all?user=${userFilter}` : '/notes/all';
  const { data, meta, page, setPage, error } = usePaged(path);

  return (
    <div>
      <h3>Everyone's notes</h3>
      {userFilter && (
        <p>
          Showing notes of one user. <button onClick={() => setUserFilter('')}>Show all</button>
        </p>
      )}
      {error && <p className="error">{error}</p>}
      {data.map((note) => (
        <div className="card" key={note._id}>
          <strong>{note.title}</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
          <span className="muted">
            {note.user ? (
              <a href="#" onClick={() => setUserFilter(note.user._id)}>
                {note.user.name} ({note.user.email})
              </a>
            ) : (
              'deleted user'
            )}{' '}
            · {new Date(note.updatedAt).toLocaleString()}
          </span>
        </div>
      ))}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
