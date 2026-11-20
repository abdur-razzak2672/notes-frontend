import { useEffect, useState } from 'react';
import { api } from './api';
import AuthPage from './pages/AuthPage';
import NotesPage from './pages/NotesPage';
import PostsPage from './pages/PostsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import AllNotesPage from './pages/AllNotesPage';
import InterestsPage from './pages/InterestsPage';

const userTabs = ['Notes', 'Posts', 'Profile'];
const adminTabs = ['Users', 'All Notes', 'Interests'];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  const [tab, setTab] = useState('Notes');

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/users/me')
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  function handleAuth({ token, user }) {
    localStorage.setItem('token', token);
    setUser(user);
    setTab('Notes');
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <AuthPage onAuth={handleAuth} />;

  const tabs = user.role === 'admin' ? [...userTabs, ...adminTabs] : userTabs;

  return (
    <>
      <header className="topbar">
        <nav>
          <span className="brand">Notes</span>
          {tabs.map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
          <span className="spacer" />
          <span className="muted">{user.name}</span>
          <span className={`badge ${user.role}`}>{user.role}</span>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="container">
        {tab === 'Notes' && <NotesPage />}
        {tab === 'Posts' && <PostsPage me={user} />}
        {tab === 'Profile' && <ProfilePage user={user} onUpdate={setUser} />}
        {tab === 'Users' && <UsersPage me={user} />}
        {tab === 'All Notes' && <AllNotesPage />}
        {tab === 'Interests' && <InterestsPage />}
      </main>
    </>
  );
}
