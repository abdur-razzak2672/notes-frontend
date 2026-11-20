import { useState } from 'react';
import { usePaged } from '../components/usePaged';
import Pager from '../components/Pager';

export default function InterestsPage() {
  const [input, setInput] = useState('');
  const [interest, setInterest] = useState('');
  const path = interest ? `/users/interests?interest=${encodeURIComponent(interest)}` : '/users/interests';
  const { data, meta, page, setPage, error } = usePaged(path);

  function search(e) {
    e.preventDefault();
    setInterest(input.trim());
  }

  return (
    <div>
      <h3>Users grouped by interest</h3>
      <form className="row" onSubmit={search}>
        <input
          style={{ flex: 1, marginBottom: 0 }}
          placeholder="Filter by interest (e.g. chess)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
        {interest && (
          <button type="button" onClick={() => { setInput(''); setInterest(''); }}>
            Clear
          </button>
        )}
      </form>
      <br />
      {error && <p className="error">{error}</p>}
      {data.length === 0 && <p className="muted">No users found.</p>}
      {data.map((group) => (
        <div className="card" key={group.interest}>
          <strong>{group.interest}</strong> <span className="muted">({group.count} users)</span>
          <div>
            {group.users.map((u) => (
              <span className="tag" key={u._id}>{u.name}</span>
            ))}
          </div>
        </div>
      ))}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
