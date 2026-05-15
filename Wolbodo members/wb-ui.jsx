// Shared UI primitives — Wolbodo Members v2
const { useState, useRef, useEffect } = React;

const ROLE_COLORS = {
  member:      '#00c4a0',
  board:       '#9b7fff',
  nerd:        '#4db6ff',
  muzikant:    '#e8a150',
  im:          '#e05593',
  klusser:     '#b5cc3a',
  wolpop:      '#ff6b6b',
  schoonmaker: '#6bc5ff',
  server:      '#aaa888',
};
const getRoleColor = (r) => ROLE_COLORS[r] || '#88aaaa';

// ── W logo mark ──────────────────────────────────────────────────────────────
const WMark = ({ size }) => {
  const s = size || 22;
  return (
    <svg width={s} height={Math.round(s * 0.77)} viewBox="0 0 22 17" fill="none" style={{ display: 'block' }}>
      <path d="M1.5 2.5L5.5 14.5L11 5.5L16.5 14.5L20.5 2.5"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Role chip — small, for table rows ────────────────────────────────────────
const RoleChip = ({ role, onClick }) => {
  const c = getRoleColor(role);
  return (
    <span
      className="role-chip"
      style={{ color: c, borderColor: c + '50', background: c + '14', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(role); } : undefined}
      title={onClick ? 'Filter by ' + role : role}
    >
      {role}
    </span>
  );
};

// ── Role tag — bigger, for profile header with optional remove ───────────────
const RoleTag = ({ role, since, onStop, confirming, onStopConfirm, onStopCancel }) => {
  const c = getRoleColor(role);
  return (
    <div className={'role-tag' + (confirming ? ' confirming' : '')}
      style={{ color: c, borderColor: c + '45', background: c + '12' }}>
      <span className="rt-name">{role}</span>
      {since && <span className="rt-since">since {since}</span>}
      {onStop && !confirming && (
        <button className="rt-remove" onClick={onStopConfirm} title={'Remove ' + role}>×</button>
      )}
      {confirming && (
        <span className="rt-confirm">
          end?
          <button className="rt-yes" onClick={onStop}>yes</button>
          <button className="rt-no" onClick={onStopCancel}>no</button>
        </span>
      )}
    </div>
  );
};

// ── Glass input / display field ───────────────────────────────────────────────
const WbField = ({ label, value, onChange, type, placeholder, canEdit, span2, multiline, mono }) => {
  const monoStyle = mono ? { fontFamily: "'Chivo Mono', monospace", fontSize: '12px', letterSpacing: '0.03em' } : {};
  const cls = 'field-g' + (span2 ? ' span-2' : '');
  return (
    <div className={cls}>
      {label && <span className="field-lbl">{label}</span>}
      {!canEdit ? (
        <span className="field-txt" style={monoStyle}>{value || <em className="field-empty">—</em>}</span>
      ) : multiline ? (
        <textarea className="field-glass" value={value || ''} onChange={e => onChange(e.target.value)}
          placeholder={placeholder || ''} style={monoStyle} />
      ) : (
        <input className="field-glass" type={type || 'text'} value={value || ''}
          onChange={e => onChange(e.target.value)} placeholder={placeholder || ''}
          style={monoStyle} autoComplete="off" />
      )}
    </div>
  );
};

// ── Toggle switch ─────────────────────────────────────────────────────────────
const WbToggle = ({ checked, onChange, label, disabled }) => (
  <div className="wb-toggle"
    style={{ opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    onClick={!disabled ? () => onChange(!checked) : undefined}>
    <div className={'toggle-track' + (checked ? ' on' : '')}>
      <div className="toggle-thumb"></div>
    </div>
    {label && <span className={'toggle-lbl' + (checked ? ' on' : '')}>{label}</span>}
  </div>
);

// ── Status badge (mail page) ──────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={'status-badge status-' + status}>{status}</span>
);

Object.assign(window, {
  getRoleColor, ROLE_COLORS,
  WMark, RoleChip, RoleTag, WbField, WbToggle, StatusBadge,
});
