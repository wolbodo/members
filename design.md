# Members — Design Reference

Internal member management app for Wolbodo. Two roles exist: **board** (full access) and **member** (own profile only). All pages require login.

---

## Global chrome

### Header (all pages)

- **Logo + "Members" title** — links to `/`
- **Nav links** (only shown when logged in):
  - Members → `/`
  - Mail → `/mail` _(board only)_
  - Changes → `/changes` _(board only)_
  - Own name → `/m/{name}`
  - Logout → `/auth/logout`
- **Search bar** — expands inline on click with a slide/scale transition. Typing filters the current page's list in real time. Collapses with ✕ or Escape.
- Active nav item is marked with a small triangle indicator at the top.

---

## Pages

---

### `/auth/login` — Log in

Single centered form.

| Element              | Detail                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Heading              | "Log in"                                                                                                    |
| Field: Name or email | Text input, placeholder "Use your nickname"                                                                 |
| Field: Password      | Password input                                                                                              |
| Link                 | "Forgot your password?" → `/auth/forgot`                                                                    |
| Submit button        | "Submit"                                                                                                    |
| Error state          | Inline message "Invalid credentials!" below password if login failed                                        |
| Redirect notice      | If `?redirect=` param is present, shows "After logging in you will be redirected to [url]" above the fields |

**Action:** POST to same page. On success → redirect to `/` (or `?redirect` value). On failure → form re-renders with error.

---

### `/auth/forgot` — Forgot password

Single centered form.

| Element       | Detail                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------- |
| Heading       | "Forgot your password?"                                                                   |
| Body text     | "We'll send a password reset link to your email to get you going."                        |
| Field: Email  | Email input                                                                               |
| Submit button | "Submit"                                                                                  |
| Error state   | Small text below field if validation fails                                                |
| Success state | Replaces form with: "If the address exists in our database, you'll shortly have an email" |

**Action:** POST. Always shows success response (no user enumeration). Sends a `password-reset` email if the address is found.

---

### `/auth/reset?token=…` — Reset password

Single centered form. Token comes from the email link.

| Element         | Detail                                    |
| --------------- | ----------------------------------------- |
| Heading         | "Set your new password"                   |
| Field: Password | Password input                            |
| Hidden field    | Token from URL query param                |
| Submit button   | "Submit"                                  |
| Error state     | Small text if token is invalid or missing |

**Action:** POST. Verifies JWT token (subject must be `password-reset`, max 30 min old). On success → updates password hash, redirects to `/`.

---

### `/` — Member list

The main overview page.

**Controls (top of page):**

- **"Create" button** → `/m/+new` _(board only, shown top-left)_
- **Toggle switch** — "Show all people" / "Show only members". Toggling adds/removes `?all` from the URL. Default shows only people with an active `member` role.

**Table columns:** Name (link), Email, Phone, Address + City, Full name, Roles

- Entire row is clickable → navigates to `/m/{name}` (if they have a member role) or `/m/{id}`.
- Name cell has a bold primary-colour link.
- List is filtered in real time by the header search bar (matches name, firstname, lastname, email).
- Empty state: "There are no people. Create a new one."

---

### `/m/+new` — Create member _(board only)_

Two-column form grid.

| Field          | Type              | Notes                      |
| -------------- | ----------------- | -------------------------- |
| name           | Text              | Required, spans full width |
| firstname      | Text              |                            |
| lastname       | Text              |                            |
| email          | Email             | Required                   |
| phone          | Phone             |                            |
| address        | Text              |                            |
| zipcode        | Text              |                            |
| city           | Text              |                            |
| country        | Text              |                            |
| bankaccount    | Text              |                            |
| keycode        | Text              | Stored as integer          |
| allow_register | Toggle (checkbox) |                            |
| allow_door     | Toggle (checkbox) |                            |
| password       | Password          |                            |
| note           | Textarea          |                            |

**Submit button** right-aligned at bottom.

**Action:** POST. Creates person, redirects to `/m/{id}`.

---

### `/m/[identifier]` — Member profile

`identifier` is either a numeric ID or a lowercase name.

**Edit toggle** — pencil icon button top-right of form (board or self only). Turns red (×) when active.

**Two-column form grid** with the same fields as create, plus:

- **name** — read-only for non-board even in edit mode
- **bankaccount** — only rendered for board or self
- **keycode** — board only
- **note** — board only (textarea)
- **password** — shown in edit mode; leaving blank keeps current password
- **allow_register / allow_door** — Toggle switches, disabled when not editing

**Roles section** (full width, below the grid):

- Heading "Roles"
- In edit mode (board only): inline form with text input + "Add" button → `?/addRole`
- List of current roles: each shows `{role} since {date}` + "Stop" button → `?/stopRole`
- Past roles section below if any exist, showing `{role} from {date} until {date}`
- "No current roles" if empty

**Metadata footer** (full width):

- `#{id}`, `created: {datetime}`, `modified: {datetime}`

**Submit button** — only visible in edit mode, right-aligned.

**Not found state:** "Person not found" heading.

**Actions:**
| Action | Who | What |
|---|---|---|
| `?/edit` | board or self | Updates changed fields, ignores blank password |
| `?/addRole` | board | Inserts a new role row with `valid_from = now` |
| `?/stopRole` | board | Sets `valid_till = now` on the role |

---

### `/changes` — Audit log _(board only)_

Searchable table of the last 500 history entries (most recent first).

**Columns:** Time, Author, Person, Role, Changes

- **Time** — formatted `DD-MM-YYYY HH:MM`
- **Author** — name of the person who made the change
- **Person** — name of the subject of the change
- **Role** — role context of the change (e.g. `board`)
- **Changes** — diff of changed fields. Each changed field shown as `fieldname: old → new`. Password changes shown as `****`.

Search bar filters by author name, person name, or role.

---

### `/mail` — Mail queue _(board only)_

Searchable table of all mail entries.

**Columns:** Status, To, Template, Time

- **Status** — e.g. `pending`, `sent`
- **To** — person name as a `mailto:` link
- **Template** — template key, e.g. `password-reset`
- **Time** — `DD-MM-YYYY HH:MM`

Search bar filters by recipient name, email, status, or template.

---

## Email templates

Sent via Nodemailer SMTP. Templates are Svelte components rendered server-side with `svelte/server render()`, using `svelte-email` layout primitives. Subject is taken from the `<title>` tag in the rendered head.

### `password-reset`

> **Subject:** Reset your password
>
> Hi {name},
>
> You or someone else requested a password reset. Follow [this link] to proceed. This link is valid for 30 minutes.

Link goes to `/auth/reset?token={jwt}` (token expires in 30 minutes).

---

### `password-change-notification`

> **Subject:** Your password has changed
>
> Hi {name},
>
> Just letting you know, your Wolbodo password has changed.

---

## Shared components

| Component      | Description                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Input`        | Labeled field. Highlights in blue when changed. Hidden when `readonly` and empty. Supports text, email, password, phone, textarea, hidden types. |
| `Toggle`       | Styled checkbox/slider switch used for boolean fields (allow_register, allow_door) and the "show all" list filter.                               |
| `Table`        | Wrapper that provides consistent table styling. Takes arbitrary `<thead>` and rows as children.                                                  |
| `RoleSelector` | Manages roles on a profile. Shows current and past roles. Add/stop forms submit inline via SvelteKit enhance (no page reload).                   |
| `Header`       | Global nav bar with search. Exports `searchValue` (reactive RegExp) and `filterFields` helper used by list pages.                                |
