# Wolbodo Design System

Wolbodo is a quirky, nerdy people-society based in Delft, NL. They run a private bar, host events, and manage members through a custom web app. The vibe: smoky back room, stoners, weirdos, hackers — warm and irreverent, not corporate.

**Source:** Hand-crafted from the `Wolbodo Members.html` redesign in this project.

---

## Products

| Surface | Description |
|---|---|
| **Members app** | Web-based member management & identity provider. Board can create/edit members, assign roles, view audit log and mail queue. Members can view/edit their own profile. |

---

## Content Fundamentals

- **Tone:** casual, direct, no fluff. Dutch informality. No exclamation marks in UI copy.
- **Casing:** sentence case for everything — buttons, labels, headings. No ALL-CAPS except micro-labels (field labels, table headers, nav items where used sparingly).
- **Person:** first person avoided; copy talks to the user directly. Short imperatives: "Save changes", "Add role", "Log in".
- **Emoji:** not used in UI. Role colours do the visual differentiation work.
- **Numbers:** dates in `d-m-yyyy` Dutch style. IDs prefixed with `#`.
- **Empty states:** dry, not cheerful. "Nobody here yet." not "Wow, nothing to see! 🎉"

---

## Visual Foundations

### Colour
Dark warm near-black base (`#131110`). Three surface levels. Teal primary (`#00c4a0`) used exclusively on interactive elements, links, active states, and accents — never as background. Borders are always neutral `rgba(white, .07–.20)`.

### Typography
- **Outfit** — display + body. Weights 400/500/600/700/800. Used for everything except technical data.
- **Chivo Mono** — monospaced. Weights 400/500. Used for IDs, keycodes, timestamps, diffs.
- Body: 14px / 1.55. Headings: 38px–26px, weight 800, tracking −0.03em.
- Field labels: 10px, weight 700, letter-spacing 0.1em, ALL CAPS.

### Backgrounds & Surfaces
Four levels: `--bg` (#131110), `--bg-s` (#1e1c1a), `--bg-c` (#272422), `--bg-h` (#302d2a).
No gradients. No textures. No imagery in the app shell.

### Borders
All neutral: `rgba(255,255,255, .07 / .12 / .20)`. Primary-tinted borders only for focus states and primary-coloured elements.

### Radius
- Cards / table-wrap: `10px`
- Buttons: `7px`
- Pills / user chip: `20px` (fully rounded)
- Dropdowns: `9px`
- Small chips: `4px`
- Inputs: `4px 4px 0 0` (flat bottom for underline style)

### Shadows
- Dropdown/save-bar: `0 8px 28–32px rgba(0,0,0,.5–.6)` — deep, dark, no colour bleed.
- Hover glow on primary button: `0 0 16px rgba(primary,.1)`.

### Animation
- Page transitions: `opacity 0→1 + translateY(5px→0)`, 180ms ease.
- Save bar: slide up from `+8px`, 200ms ease.
- All micro-transitions: `150–200ms`. No bounces.
- Hover states: colour shift only (no scale, no lift).

### Cards / Surfaces
- Bordered (`1px solid --bd`) + `border-radius: 10px` + `overflow: hidden`.
- No drop shadows on cards. Separation done by border + bg contrast.
- Table rows hover: `--bg-h` background.
- Mobile cards: `border-left: 3px solid transparent` that tints to primary on hover.

### Scrollbar
Narrow (5px), thumb = `--bd-m`, track = `--bg`. Scrollbar hidden on pill rows.

### Iconography
No icon library. The W logomark is a custom inline SVG path. UI actions use Unicode characters (`✉`, `↗`, `←`, `×`, `✓`). Field labels and table headers use text, not icons.

### Density
Two modes via `data-density` attribute on root: `normal` (default) and `compact` (tighter table rows + role tags).

---

## Role Colour System

Each role has a fixed accent colour used for chip/tag background tint, border tint, and text:

| Role | Colour |
|---|---|
| member | `#00c4a0` |
| board | `#9b7fff` |
| nerd | `#4db6ff` |
| muzikant | `#e8a150` |
| im | `#e05593` |
| klusser | `#b5cc3a` |
| wolpop | `#ff6b6b` |
| schoonmaker | `#6bc5ff` |
| server | `#aaa888` |

---

## Files

| File | Description |
|---|---|
| `README.md` | This file |
| `colors_and_type.css` | All CSS custom properties — tokens + semantic vars |
| `SKILL.md` | Agent skill descriptor |
| `preview/` | Design System tab cards |
| `ui_kits/members/` | Members app UI kit |
| `Wolbodo Members.html` | Live prototype (root) |
