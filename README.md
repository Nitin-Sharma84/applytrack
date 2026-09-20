# ApplyTrack

A job and placement application tracker for students, built with React. Track companies, deadlines, interview rounds, follow-ups and offers in one place. No backend, no account, no UI libraries.

## Problem statement

During campus placements, applications are scattered across email, LinkedIn, Naukri, Internshala and WhatsApp groups. Deadlines are missed, follow-ups are forgotten and it is hard to see which sources actually lead to interviews. ApplyTrack keeps everything in one dashboard.

## Features

**Track**
- Add, edit and delete applications with inline validation, and a 5 second Undo after delete
- Status pipeline: Wishlist, Applied, Online Test, Interview, Offer, Rejected (every change is recorded in a history)
- Search (debounced), filters, sorting, tag filter, smart badges (deadline countdown, Urgent, Overdue, Follow-up due)
- Table on desktop and cards on mobile

**Plan**
- Dashboard with stats, response and offer rate, upcoming deadlines and interviews, reminders
- Weekly goal with progress ring and comparison with last week, copyable weekly report
- Kanban board with drag and drop (plus a status menu for keyboard and touch)
- Detail drawer: status timeline, interview rounds, preparation checklist, notes

**Understand**
- Analytics: funnel with conversion, applications per week, status donut, source table, generated insights
- Offer comparison (up to 3 offers side by side)

**Manage**
- JSON backup and validated import (merge or replace), CSV export of the filtered list
- Light and dark theme (follows the device by default), settings page
- Keyboard shortcuts: `N` new, `/` search, `?` help, `Esc` close
- Sample data (12 realistic applications) for exploring

## Tech stack

React, Vite, JavaScript (JSX), plain CSS with CSS variables. Only `react`, `react-dom` and Vite defaults as dependencies. No Redux, router, chart, date, drag and drop, icon or UI libraries.

## Screenshots

Add these to `docs/screenshots/` and link them here:

1. `dashboard-light.png`: Dashboard with sample data loaded (light theme)
2. `dashboard-dark.png`: the same page in dark theme
3. `applications.png`: list with filters and status tabs
4. `board.png`: Kanban board while a card is being dragged
5. `drawer.png`: detail drawer with timeline, rounds and checklist
6. `analytics.png`: funnel, donut and weekly chart
7. `mobile.png`: Applications page at 390px width

## Folder structure

```
src/
  main.jsx, App.jsx        entry point and page switching
  components/
    layout/                AppShell, Sidebar, Topbar, MobileNav
    ui/                    reusable pieces: Button, Input, Modal, Drawer, Toast, ProgressRing...
    applications/          form, table, cards, filter bar, badges
    board/                 Kanban board
    dashboard/             stat cards, lists, weekly goal
    analytics/             SVG charts, source table, offer comparison
    details/               drawer content: timeline, rounds, checklist, notes
    settings/              import dialog
  pages/                   one file per screen
  context/                 Applications, Settings, Toast, Confirm, Form, Drawer providers
  reducers/                applicationsReducer (pure)
  hooks/                   custom hooks (debounce, focus trap, shortcuts, filtering...)
  services/                storage, export, import (the only place that touches localStorage)
  utils/                   pure helper functions: dates, validation, stats, analytics, csv
  constants/               statuses, options, storage keys, sample data
  styles/                  tokens (design variables), base, animations, utilities
```

## Concepts used

| Concept | Where |
|---|---|
| `useReducer` + Context | `reducers/applicationsReducer.js`, `context/ApplicationsContext.jsx` |
| Pure reducer, immutable updates | `applicationsReducer.js` (`updateById`) |
| Custom hooks | `hooks/` (`useDebounce`, `useFocusTrap`, `useKeyboardShortcut`, `useFilteredApplications`) |
| Derived state (nothing computed is stored) | `utils/applicationHelpers.js`, `useFilteredApplications`, analytics |
| Controlled forms and validation | `components/applications/ApplicationForm.jsx`, `utils/validators.js` |
| Lifting state up | filters live in `App.jsx`, shared by top bar, list and board |
| Composition, render props | `ui/Field.jsx` (render prop), `ui/Modal.jsx`, `ui/Drawer.jsx` |
| Lists and stable keys | every `.map()` uses ids |
| `useEffect` cleanup | `useDebounce` (timer), `useKeyboardShortcut` (listener), `ToastContext` (timers) |
| `useRef` | focus trap, toast timers, confirm promise, file input |
| `useMemo`, `useCallback`, `React.memo` | table rows, cards, Kanban cards, context values (each with a reason in a comment) |
| `useSyncExternalStore` | `useTheme`, `useMediaQuery` |
| Error boundary | `ui/ErrorBoundary.jsx` |
| Portals | `Modal`, `Drawer`, `ToastViewport` |
| localStorage service layer | `services/storage.js` |
| HTML5 drag and drop | `components/board/` |
| CSS variables and theming | `styles/tokens.css` |
| Responsive design | breakpoints in layout CSS, table vs cards |
| Accessibility | focus trap, skip link, aria-live toasts, labels, not relying on color alone |
| SVG charts | `components/analytics/` |

## Run locally

```bash
npm install
npm run dev        # development server
npm run lint       # code quality
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Requires a recent Node.js (20.19+ or 22.12+).

## How data is stored

All data is saved in the browser's `localStorage` under keys starting with `applytrack:`. Only `src/services/storage.js` reads or writes it. It wraps every call in `try/catch`, keeps a schema version key for future migrations, falls back to empty data when stored JSON is corrupted (and keeps a backup copy of the bad data), and validates and repairs every record when loading.

## Limitations

- Data lives in one browser on one device. Clearing site data deletes it, so download backups from Settings.
- No login, sync or multi-device support.
- Navigation is state based, so there are no shareable page URLs and the browser back button does not change pages.
- Drag and drop uses the HTML5 API, which is unreliable on touch screens (the status menu on each card is the alternative).
- Modals and drawers animate in, but not out.
- "Follow-up due" uses the last update time, so editing an application resets its follow-up timer.
- The storage service is synchronous. A real API is asynchronous, so the providers would need loading states.

## Future improvements and migration to Node, Express and MongoDB

Because components never touch `localStorage`, the backend can be added by rewriting `services/storage.js` only:

1. Express API: `GET/POST /api/applications`, `PUT/DELETE /api/applications/:id`, plus endpoints for rounds, checklist and notes. Mongoose model with the same fields as the application object.
2. Replace `loadApplications` and `saveApplications` with `fetch` calls. Make them async and add loading and error states in `ApplicationsProvider`.
3. Move `sanitizeApplications` and the validators to the server so data is validated there too.
4. Add authentication (JWT or sessions) so each user has their own data.
5. Later: email reminders for deadlines, browser notifications, React Router for real URLs, tests (Vitest and React Testing Library).