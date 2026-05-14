// App shell — Wolbodo Members v2
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00c4a0",
  "fontMode": "outfit",
  "density": "normal",
  "redirectUrl": ""
}/*EDITMODE-END*/;

// ── User chip + dropdown ──────────────────────────────────────────────────────
const UserChip = ({ user, onProfile, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const initial = (user?.name || '?')[0].toUpperCase();

  return (
    <div className="user-chip" ref={ref} onClick={() => setOpen(o => !o)}>
      <div className="user-avatar">{initial}</div>
      <span className="user-name">{user?.name}</span>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {open && (
        <div className="user-dd">
          <button onClick={(e) => { e.stopPropagation(); setOpen(false); onProfile(); }}>My profile</button>
          <hr className="dd-sep" />
          <button className="danger" onClick={(e) => { e.stopPropagation(); setOpen(false); onLogout(); }}>Log out</button>
        </div>
      )}
    </div>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────
const WbHeader = ({ page, currentUser, onNavigate, searchQuery, onSearch }) => {
  const isBoard = currentUser?.roles?.some(r => r.role === 'board');

  return (
    <header className="app-header">
      <div className="header-brand" onClick={() => onNavigate('members', null)}>
        <span className="header-wmark"><WMark size={18} /></span>
        <span className="header-wordmark">wolbodo <em>members</em></span>
      </div>

      <nav className="header-nav">
        {[
          { label: 'Members', target: 'members', always: true, cls: 'nav-link-home' },
          { label: 'Mail',    target: 'mail',    board: true },
          { label: 'Changes', target: 'changes', board: true },
        ].filter(l => l.always || (l.board && isBoard)).map(l => (
          <button key={l.target}
            className={'nav-link' + (page === l.target ? ' active' : '') + (l.cls ? ' ' + l.cls : '')}
            onClick={() => onNavigate(l.target, null)}>
            {l.label}
          </button>
        ))}
      </nav>

      {/* Global search — only on Changes + Mail where it makes sense */}
      {(page === 'changes' || page === 'mail') && (
        <div className="header-search">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--txt3)', flexShrink: 0 }}>
            <circle cx="5.8" cy="5.8" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 9L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input className="header-search-input" value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder={'Search ' + page + '…'}
            onKeyDown={e => e.key === 'Escape' && onSearch('')} />
          {searchQuery && <button className="search-x" style={{ marginLeft: 4 }} onClick={() => onSearch('')}>×</button>}
        </div>
      )}

      <UserChip
        user={currentUser}
        onProfile={() => onNavigate('member-profile', currentUser)}
        onLogout={() => onNavigate('logout', null)}
      />
    </header>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage]         = useState('members');
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearch] = useState('');
  const [members, setMembers]   = useState(WB_DATA.members.slice());

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--pri', tweaks.accent);
    r.style.setProperty('--pri-bg', tweaks.accent + '14');
    r.style.setProperty('--pri-bd', tweaks.accent + '40');
    if (tweaks.fontMode === 'mono') {
      r.style.setProperty('--font', "'Chivo Mono', monospace");
    } else {
      r.style.setProperty('--font', "'Outfit', sans-serif");
    }
    r.setAttribute('data-density', tweaks.density);
  }, [tweaks.accent, tweaks.fontMode, tweaks.density]);

  const currentUser = members[0]; // Klaas — board

  const navigate = (target, data) => {
    if (target === 'logout') { setLoggedIn(false); setPage('members'); return; }
    if (target === 'member-profile' && data) setSelected(data);
    if (target === 'member-new') setSelected(null);
    setPage(target);
    setSearch('');
  };

  const handleSave = (updated) => {
    if (members.some(m => m.id === updated.id)) {
      setMembers(ms => ms.map(m => m.id === updated.id ? updated : m));
      setSelected(updated);
    } else {
      setMembers(ms => [...ms, updated]);
      navigate('member-profile', updated);
    }
  };

  if (!loggedIn) return (
    <>
      <LoginPage onLogin={() => setLoggedIn(true)}
        redirectUrl={tweaks.redirectUrl || new URLSearchParams(window.location.search).get('redirect') || ''} />
      <TweaksPanel tweaks={tweaks} setTweak={setTweak}>
        <TweakSection label="Appearance">
          <TweakColor label="Accent" value={tweaks.accent} onChange={v => setTweak('accent', v)}
            options={['#00c4a0', '#9b7fff', '#e8a150', '#e05593', '#4db6ff']} />
        </TweakSection>
        <TweakSection label="Login">
          <TweakText label="Redirect URL" value={tweaks.redirectUrl} onChange={v => setTweak('redirectUrl', v)}
            placeholder="/some/path" />
        </TweakSection>
      </TweaksPanel>
    </>
  );

  return (
    <div className="app-root">
      <WbHeader page={page} currentUser={currentUser}
        onNavigate={navigate} searchQuery={searchQuery} onSearch={setSearch} />
      <main className="app-main">
        {page === 'members' && (
          <MemberListPage members={members} onNavigate={navigate} isBoard={true} />
        )}
        {(page === 'member-profile') && (
          <MemberProfilePage member={selected} currentUser={currentUser}
            onNavigate={navigate} onSave={handleSave} />
        )}
        {page === 'member-new' && (
          <MemberProfilePage member={null} currentUser={currentUser}
            isNew={true} onNavigate={navigate} onSave={handleSave} />
        )}
        {page === 'changes' && (
          <ChangesPage changes={WB_DATA.changes} searchQuery={searchQuery} />
        )}
        {page === 'mail' && (
          <MailPage mail={WB_DATA.mail} searchQuery={searchQuery} />
        )}
      </main>
      <TweaksPanel tweaks={tweaks} setTweak={setTweak}>
        <TweakSection label="Appearance">
          <TweakColor label="Accent" value={tweaks.accent} onChange={v => setTweak('accent', v)}
            options={['#00c4a0', '#9b7fff', '#e8a150', '#e05593', '#4db6ff']} />
          <TweakRadio label="Font" value={tweaks.fontMode} onChange={v => setTweak('fontMode', v)}
            options={[{ value: 'outfit', label: 'Outfit' }, { value: 'mono', label: 'Mono' }]} />
          <TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak('density', v)}
            options={[{ value: 'normal', label: 'Normal' }, { value: 'compact', label: 'Compact' }]} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
