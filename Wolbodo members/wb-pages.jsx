// All page components — Wolbodo Members v2
const { useState, useRef, useEffect } = React;

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin, redirectUrl }) => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr]   = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!name || !pass) { setErr(true); return; }
    setBusy(true);
    setTimeout(() => { setBusy(false); onLogin(name); }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-top">
          <span className="login-wmark"><WMark size={40} /></span>
          <h1 className="login-title">wolbodo <span>members</span></h1>
          <p className="login-sub">member management &amp; identity</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          {redirectUrl && (
            <div className="login-redirect">
              After logging in you will be redirected to{' '}
              <a href={redirectUrl} className="login-redirect-link">{redirectUrl}</a>
            </div>
          )}
          {err && <div className="login-err">Invalid credentials</div>}
          <div className="lf-group">
            <label className="lf-label">Name or email</label>
            <input className="lf-input" value={name} onChange={e => { setName(e.target.value); setErr(false); }}
              placeholder="your nickname" autoFocus />
          </div>
          <div className="lf-group">
            <label className="lf-label">Password</label>
            <input className="lf-input" type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(false); }} />
          </div>
          <div className="lf-actions">
            <button type="button" className="lf-forgot">Forgot password?</button>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? '···' : 'Log in'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MEMBER LIST ──────────────────────────────────────────────────────────────
const MemberListPage = ({ members, onNavigate, isBoard }) => {
  const [tab, setTab]               = useState('members');
  const [query, setQuery]           = useState('');
  const [roleFilter, setRoleFilter] = useState(null);

  const allRoles = [...new Set(members.flatMap(m => m.roles.map(r => r.role)))].sort();

  const filtered = members.filter(m => {
    if (tab === 'members' && !m.roles.some(r => r.role === 'member')) return false;
    if (roleFilter && !m.roles.some(r => r.role === roleFilter)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.firstname || '').toLowerCase().includes(q) ||
      (m.lastname  || '').toLowerCase().includes(q) ||
      (m.email     || '').toLowerCase().includes(q) ||
      (m.phone     || '').includes(q) ||
      m.roles.some(r => r.role.includes(q))
    );
  });

  const memberCount   = members.filter(m => m.roles.some(r => r.role === 'member')).length;
  const everyoneCount = members.length;

  return (
    <div className="page">
      <div className="list-head">
        <div className="list-tabs">
          <button className={'tab' + (tab === 'members' ? ' active' : '')} onClick={() => setTab('members')}>
            Members <span className="tab-count">{memberCount}</span>
          </button>
          <button className={'tab' + (tab === 'all' ? ' active' : '')} onClick={() => setTab('all')}>
            Everyone <span className="tab-count">{everyoneCount}</span>
          </button>
        </div>
        {isBoard && (
          <button className="btn btn-primary" onClick={() => onNavigate('member-new', null)}>+ New member</button>
        )}
      </div>

      <div className="list-filters">
        <div className="list-search">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--txt3)' }}>
            <circle cx="5.8" cy="5.8" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 9L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, role…"
            onKeyDown={e => e.key === 'Escape' && setQuery('')} />
          {query && <button className="search-x" onClick={() => setQuery('')}>×</button>}
        </div>
        <div className="role-filter-pills">
          {allRoles.map(r => (
            <button key={r}
              className={'pill' + (roleFilter === r ? ' active' : '')}
              style={roleFilter === r ? { color: getRoleColor(r), borderColor: getRoleColor(r) + '60', background: getRoleColor(r) + '14' } : {}}
              onClick={() => setRoleFilter(roleFilter === r ? null : r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          {query || roleFilter ? 'No matches — try clearing the filters' : 'Nobody here yet.'}
        </div>
      ) : (
        <div className="table-wrap mem-tw">
          <table className="wb-table">
            <thead>
              <tr>
                <th className="col-name">Name</th>
                <th className="col-email">Email</th>
                <th className="col-phone">Phone</th>
                <th className="col-city">City</th>
                <th className="col-fullname">Full name</th>
                <th className="col-roles">Roles</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="tr-row" onClick={() => onNavigate('member-profile', m)}>
                  <td className="td-name col-name">
                    {m.name}
                    {/* card-only content */}
                    <span className="card-sub">
                      {[m.firstname, m.lastname].filter(Boolean).join(' ')}{m.city ? ' · ' + m.city : ''}
                    </span>
                    <span className="card-contact">
                      {m.email && <a href={'mailto:' + m.email} onClick={e => e.stopPropagation()}>{m.email}</a>}
                      {m.email && m.phone && <span className="card-sep">·</span>}
                      {m.phone && <a href={'tel:' + m.phone} onClick={e => e.stopPropagation()}>{m.phone}</a>}
                    </span>
                  </td>
                  <td className="td-dim col-email">
                    {m.email}
                    {m.email && (
                      <a href={'mailto:' + m.email} className="quick-act"
                        onClick={e => e.stopPropagation()} title="Email">✉</a>
                    )}
                  </td>
                  <td className="td-dim col-phone">
                    {m.phone}
                    {m.phone && (
                      <a href={'tel:' + m.phone} className="quick-act"
                        onClick={e => e.stopPropagation()} title="Call">↗</a>
                    )}
                  </td>
                  <td className="td-dim col-city">{m.city || '—'}</td>
                  <td className="td-dim col-fullname">{[m.firstname, m.lastname].filter(Boolean).join(' ') || '—'}</td>
                  <td className="col-roles">
                    <div className="td-roles">
                      {m.roles.slice(0, 3).map((r, i) => (
                        <RoleChip key={i} role={r.role} onClick={setRoleFilter} />
                      ))}
                      {m.roles.length > 3 && (
                        <span className="roles-more" title={m.roles.slice(3).map(r => r.role).join(', ')}>
                          +{m.roles.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── MEMBER PROFILE ───────────────────────────────────────────────────────────
const MemberProfilePage = ({ member, currentUser, isNew, onNavigate, onSave }) => {
  const isBoard = currentUser.roles && currentUser.roles.some(r => r.role === 'board');
  const isSelf  = member && currentUser.id === member.id;
  const canEdit = isBoard || isSelf || isNew;

  const blank = { name:'', firstname:'', lastname:'', email:'', phone:'', address:'', zipcode:'', city:'', country:'', bankaccount:'', keycode:'', allow_register: false, allow_door: false, note:'', password:'' };
  const [form,      setForm]      = useState(member ? { ...member } : blank);
  const [roles,     setRoles]     = useState(member ? [...member.roles] : []);
  const [pastRoles, setPastRoles] = useState(member ? [...member.past_roles] : []);
  const [dirty,     setDirty]     = useState(!!isNew);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole,   setNewRole]   = useState('');
  const [stopIdx,   setStopIdx]   = useState(-1);
  const [saved,     setSaved]     = useState(false);
  const roleInputRef = useRef(null);

  useEffect(() => { if (addingRole && roleInputRef.current) roleInputRef.current.focus(); }, [addingRole]);

  const set = key => val => { setForm(f => ({ ...f, [key]: val })); setDirty(true); };

  const addRole = () => {
    if (!newRole.trim()) { setAddingRole(false); return; }
    const d = new Date();
    const since = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    setRoles(r => [...r, { role: newRole.trim().toLowerCase(), since }]);
    setNewRole(''); setAddingRole(false); setDirty(true);
  };

  const stopRole = (i) => {
    const r = roles[i];
    const d = new Date();
    const until = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    setPastRoles(p => [...p, { role: r.role, from: r.since, until }]);
    setRoles(roles.filter((_, idx) => idx !== i));
    setStopIdx(-1); setDirty(true);
  };

  const save = () => {
    const updated = { ...form, roles, past_roles: pastRoles };
    if (!updated.id) updated.id = Date.now();
    const d = new Date();
    updated.modified = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    if (!member) updated.created = updated.modified;
    onSave(updated);
    setDirty(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const discard = () => {
    setForm(member ? { ...member } : blank);
    setRoles(member ? [...member.roles] : []);
    setPastRoles(member ? [...member.past_roles] : []);
    setDirty(false);
  };

  const primaryRole  = roles[0]?.role || 'member';
  const primaryColor = getRoleColor(primaryRole);
  const memberSince  = roles.find(r => r.role === 'member')?.since;

  if (!member && !isNew) return (
    <div className="page"><div className="empty-state" style={{ paddingTop: 80 }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Person not found</div>
      <button className="btn btn-outline" onClick={() => onNavigate('members', null)}>← back</button>
    </div></div>
  );

  return (
    <div className="page profile-page">
      <button className="back-btn" onClick={() => onNavigate('members', null)}>← members</button>

      <div className="profile-hd" style={{ borderLeftColor: primaryColor }}>
        <div className="profile-hd-main">
          <h1 className="profile-name">{form.name || 'new member'}</h1>
          {(form.firstname || form.lastname) && (
            <span className="profile-realname">{[form.firstname, form.lastname].filter(Boolean).join(' ')}</span>
          )}
        </div>
        {member && (
          <div className="profile-hd-meta">
            {memberSince && <span className="meta-since">member since {memberSince}</span>}
            <span className="meta-id">#{member.id}</span>
          </div>
        )}
      </div>

      <div className="roles-chips-row">
        {roles.map((r, i) => (
          <RoleTag key={i} role={r.role} since={r.since}
            onStop={isBoard ? () => stopRole(i) : null}
            confirming={stopIdx === i}
            onStopConfirm={isBoard ? () => setStopIdx(i) : null}
            onStopCancel={() => setStopIdx(-1)} />
        ))}
        {roles.length === 0 && !addingRole && <span className="no-roles-hint">no active roles</span>}
        {isBoard && (addingRole ? (
          <div className="role-add-inline">
            <input ref={roleInputRef} className="role-add-in" value={newRole}
              onChange={e => setNewRole(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addRole(); if (e.key === 'Escape') { setAddingRole(false); setNewRole(''); } }}
              placeholder="role name…"
              onBlur={() => { setTimeout(() => { if (!newRole) setAddingRole(false); }, 150); }} />
            <button className="btn-add-role-ok" onMouseDown={addRole}>add</button>
          </div>
        ) : (
          <button className="role-add-btn" onClick={() => setAddingRole(true)}>+ add role</button>
        ))}
      </div>

      <hr className="prof-div" />

      <div className="form-sections">
        <div className="form-sec">
          <span className="form-sec-lbl">Identity</span>
          <div className="form-g2">
            <WbField label="Nickname" value={form.name} onChange={set('name')} canEdit={canEdit && (isBoard || !!isNew)} span2 />
            <WbField label="First name" value={form.firstname} onChange={set('firstname')} canEdit={canEdit} />
            <WbField label="Last name"  value={form.lastname}  onChange={set('lastname')}  canEdit={canEdit} />
          </div>
        </div>

        <div className="form-sec">
          <span className="form-sec-lbl">Contact</span>
          <div className="form-g2">
            <WbField label="Email" value={form.email} onChange={set('email')} type="email" canEdit={canEdit} />
            <WbField label="Phone" value={form.phone} onChange={set('phone')} type="tel"   canEdit={canEdit} />
          </div>
        </div>

        <div className="form-sec">
          <span className="form-sec-lbl">Location</span>
          <div className="form-g2">
            <WbField label="Address" value={form.address} onChange={set('address')} canEdit={canEdit} />
            <WbField label="Zipcode" value={form.zipcode} onChange={set('zipcode')} canEdit={canEdit} />
            <WbField label="City"    value={form.city}    onChange={set('city')}    canEdit={canEdit} />
            <WbField label="Country" value={form.country} onChange={set('country')} canEdit={canEdit} />
          </div>
        </div>

        {(isBoard || isSelf) && (
          <div className="form-sec">
            <span className="form-sec-lbl">System</span>
            <div className="form-g2">
              {(isBoard || isSelf) && <WbField label="Bank account" value={form.bankaccount} onChange={set('bankaccount')} canEdit={canEdit} />}
              {isBoard && <WbField label="Keycode" value={form.keycode} onChange={set('keycode')} canEdit={canEdit} mono />}
              {canEdit  && <WbField label="New password" value={form.password} onChange={set('password')} type="password" placeholder="leave blank to keep" canEdit={true} />}
              <div className="toggles-pair">
                <WbToggle checked={form.allow_register} onChange={v => { set('allow_register')(v); }} label="Allow register" disabled={!canEdit} />
                <WbToggle checked={form.allow_door}     onChange={v => { set('allow_door')(v); }}     label="Allow door"     disabled={!canEdit} />
              </div>
            </div>
          </div>
        )}

        {isBoard && (
          <div className="form-sec">
            <span className="form-sec-lbl">Notes</span>
            <WbField value={form.note} onChange={set('note')} placeholder="Internal notes…" canEdit={canEdit} multiline span2 />
          </div>
        )}
      </div>

      {pastRoles.length > 0 && (
        <div className="role-history">
          <hr className="prof-div" />
          <span className="form-sec-lbl">Role history</span>
          <div className="rh-list">
            {pastRoles.map((r, i) => (
              <div key={i} className="rh-item">
                <span className="rh-role" style={{ color: getRoleColor(r.role) }}>{r.role}</span>
                <span className="rh-range">{r.from} → {r.until}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {member && (
        <div className="prof-meta">
          <span>#{member.id}</span>
          <span>created {member.created}</span>
          <span>modified {member.modified}</span>
        </div>
      )}

      {dirty && canEdit && (
        <div className="save-bar">
          <span className="save-bar-dot"></span>
          <span className="save-bar-msg">Unsaved changes</span>
          <button className="btn btn-ghost-sm" onClick={discard}>Discard</button>
          <button className="btn btn-primary" onClick={save}>Save changes</button>
        </div>
      )}
      {saved && !dirty && (
        <div className="save-bar save-bar-ok">
          <span>✓ Saved</span>
        </div>
      )}
    </div>
  );
};

// ─── CHANGES ──────────────────────────────────────────────────────────────────
const ChangesPage = ({ changes, searchQuery }) => {
  const filtered = changes.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.author.toLowerCase().includes(q) || c.person.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  const fmtVal = (v) => {
    if (v === null || v === undefined) return <em className="ch-null">null</em>;
    if (v === '****') return <span className="ch-pass">••••</span>;
    const s = String(v);
    if (s.includes('T') && s.length > 16) return s.slice(0, 10);
    return s.length > 55 ? s.slice(0, 55) + '…' : s;
  };

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">Changes</h1>
        <span className="page-count">{filtered.length} entries</span>
      </div>
      <div className="table-wrap ch-tw">
        <table className="wb-table">
          <thead>
            <tr>
              <th className="ch-col-time">Time</th>
              <th className="ch-col-who">Who</th>
              <th className="ch-col-role">Role</th>
              <th>Changes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={4} className="empty-state">No results</td></tr>
              : filtered.map(c => (
                <tr key={c.id} style={{ verticalAlign: 'top', cursor: 'default' }}>
                  <td className="td-dim ch-time ch-col-time">{c.time}</td>
                  <td className="ch-col-who">
                    <span className="td-name" style={{ fontSize: 13 }}>{c.author}</span>
                    {c.author !== c.person && (
                      <span className="ch-person">→ {c.person}</span>
                    )}
                  </td>
                  <td className="td-dim ch-col-role" style={{ fontSize: 11 }}>{c.role}</td>
                  <td>
                    {c.fields.map((f, i) => (
                      <div key={i} className="ch-line">
                        <span className="ch-field">{f.field}:</span>
                        {' '}<span className="ch-old">{fmtVal(f.old)}</span>
                        <span className="ch-arr"> → </span>
                        <span className="ch-new">{fmtVal(f.new)}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── MAIL ─────────────────────────────────────────────────────────────────────
const MailPage = ({ mail, searchQuery }) => {
  const filtered = mail.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.to.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) ||
           m.template.toLowerCase().includes(q) || m.status.toLowerCase().includes(q);
  });

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">Mail</h1>
        <span className="page-count">{filtered.length} entries</span>
      </div>
      <div className="table-wrap mail-tw">
        <table className="wb-table">
          <thead>
            <tr>
              <th className="mail-col-status">Status</th>
              <th className="mail-col-to">To</th>
              <th className="mail-col-tmpl">Template</th>
              <th className="mail-col-time">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={4} className="empty-state">No mail found</td></tr>
              : filtered.map(m => (
                <tr key={m.id} style={{ cursor: 'default' }}>
                  <td className="mail-col-status"><StatusBadge status={m.status} /></td>
                  <td className="mail-col-to">
                    <a href={'mailto:' + m.email} className="td-name"
                      style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                      {m.to}
                    </a>
                    <span className="mail-sub">{m.email}</span>
                    <span className="mail-card-meta">{m.template} · {m.time}</span>
                  </td>
                  <td className="td-dim mail-col-tmpl">{m.template}</td>
                  <td className="td-dim mail-col-time">{m.time}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

Object.assign(window, {
  LoginPage, MemberListPage, MemberProfilePage, ChangesPage, MailPage,
});
