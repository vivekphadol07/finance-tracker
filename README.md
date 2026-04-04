# Finance Tracker Dashboard

A modern, frontend-only finance dashboard built with React, Redux Toolkit, and Tailwind CSS.  
It helps users track balances, analyze spending, manage budgets, and monitor bill reminders through an interactive UI.

Live Demo: [Finance-Tracker Demo](https://finance-tracker-rho-tawny.vercel.app/)  
Alternate Demo: [GitHub Pages](https://vivekphadol07.github.io/finance-tracker/)

## Highlights
- Dashboard overview with summary cards (`Total Balance`, `Income`, `Expenses`, `Savings`)
- Time-based and category-based charts using Recharts
- Transactions management with:
  - Search
  - Type filter
  - Date presets + custom range
  - Inline edit/delete (Admin)
  - Download filtered history + download full history
- Frontend role-based UI simulation (`Admin` / `Viewer`)
- Budget planning with monthly and category limits
- Bills and due-date reminders
- Insights/analytics sections for spending patterns
- Light/Dark theme toggle
- Persistent state using `localStorage`

## Role-Based Behavior
- `Viewer`
  - Can view dashboard, transactions, budgets, and bills
  - Cannot add/edit/delete transactions or bills
- `Admin`
  - Full access to add/edit/delete and budget configuration

Role can be switched from the top navbar for demo/testing.

## Tech Stack
- React 19 + Vite
- Redux Toolkit + React Redux
- Tailwind CSS 4
- Recharts (visualizations)
- Sonner (toasts)
- React Icons

## Project Structure
```text
src/
  components/
    bills/
    dashboard/
    layout/
    transactions/
    ui/
  pages/
    Dashboard.jsx
    TransactionsPage.jsx
    BudgetsPage.jsx
    AnalyticsPage.jsx
    SettingsPage.jsx
  redux/
    Slices/
    store.jsx
  data/
    data.js
  services/
    mockApi.js
  utils/
    exportUtils.js
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

### 5. Lint
```bash
npm run lint
```

## Data & Persistence
- Seeded mock transactions are generated in `src/data/data.js`
- App state is persisted in browser `localStorage` under key: `trackerState`
- If you want fresh seeded data, clear local storage and reload:
```js
localStorage.removeItem('trackerState')
```

## Export Notes
- **Download Filtered Excel** exports only current filtered transactions (CSV format, Excel-compatible)
- **Download All History** exports the complete transaction history

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview build locally
- `npm run lint` - run ESLint
- `npm run deploy` - deploy `dist` to GitHub Pages

## Repository
- GitHub: [vivekphadol07/finance-tracker](https://github.com/vivekphadol07/finance-tracker)
