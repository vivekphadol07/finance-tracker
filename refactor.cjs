const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dirsToCreate = [
  'components/layout',
  'components/dashboard',
  'components/transactions',
  'pages',
  'data'
];

// Create dirs
dirsToCreate.forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const moves = [
  { from: 'components/Navbar.jsx', to: 'components/layout/Navbar.jsx' },
  { from: 'components/Sidebar.jsx', to: 'components/layout/Sidebar.jsx' },
  { from: 'components/ThemeSwitcher.jsx', to: 'components/layout/ThemeSwitcher.jsx' },
  { from: 'components/DashboardCards.jsx', to: 'components/dashboard/DashboardCards.jsx' },
  { from: 'components/SpendingChart.jsx', to: 'components/dashboard/SpendingChart.jsx' },
  { from: 'components/TransactionForm.jsx', to: 'components/transactions/TransactionForm.jsx' },
  { from: 'components/TransactionsList.jsx', to: 'components/transactions/TransactionsList.jsx' },
  { from: 'components/Dashboard.jsx', to: 'pages/Dashboard.jsx' },
  { from: 'components/AnalyticsPage.jsx', to: 'pages/AnalyticsPage.jsx' },
  { from: 'components/BudgetsPage.jsx', to: 'pages/BudgetsPage.jsx' },
  { from: 'components/BudgetManager.jsx', to: 'pages/BudgetManager.jsx' },
  { from: 'components/DataManagement.jsx', to: 'pages/DataManagement.jsx' },
  { from: 'components/Insights.jsx', to: 'pages/Insights.jsx' },
  { from: 'components/SettingsPage.jsx', to: 'pages/SettingsPage.jsx' },
  { from: 'components/TransactionsPage.jsx', to: 'pages/TransactionsPage.jsx' },
  { from: 'data.js', to: 'data/data.js' },
];

moves.forEach(({from, to}) => {
  const fromPath = path.join(srcDir, from);
  const toPath = path.join(srcDir, to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
  }
});

// Import Fixes
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// Global replace logic for data.js
const allFiles = [];
function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            allFiles.push(fullPath);
        }
    });
}
walkDir(srcDir);

allFiles.forEach(file => {
    if (!file.endsWith('.js') && !file.endsWith('.jsx')) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix imports for `data.js` depending on depth!
    // Instead of regex madness, let's fix the specific paths from each category

    // If file is in pages/ -> depth is 1
    if (file.includes(path.join('src', 'pages'))) {
        content = content.replace(/from\s+['"]\.\/([^'"]+)['"]/g, "from '../components/$1'");
        content = content.replace(/from\s+['"]\.\.\/redux/g, "from '../redux");
        content = content.replace(/from\s+['"]\.\/ui/g, "from '../components/ui");
        content = content.replace(/from\s+['"]\.\/SpendingChart['"]/g, "from '../components/dashboard/SpendingChart'");
        content = content.replace(/from\s+['"]\.\/DashboardCards['"]/g, "from '../components/dashboard/DashboardCards'");
        content = content.replace(/from\s+['"]\.\/Insights['"]/g, "from '../pages/Insights'");
        content = content.replace(/from\s+['"]\.\.\/components\/Insights['"]/g, "from './Insights'");
        content = content.replace(/from\s+['"]\.\/BudgetManager['"]/g, "from './BudgetManager'");
        content = content.replace(/from\s+['"]\.\.\/components\/BudgetManager['"]/g, "from './BudgetManager'");
        content = content.replace(/from\s+['"]\.\/TransactionForm['"]/g, "from '../components/transactions/TransactionForm'");
        content = content.replace(/from\s+['"]\.\/TransactionsList['"]/g, "from '../components/transactions/TransactionsList'");
        content = content.replace(/from\s+['"]\.\/DataManagement['"]/g, "from './DataManagement'");
        content = content.replace(/from\s+['"]\.\.\/components\/DataManagement['"]/g, "from './DataManagement'");

        content = content.replace(/from\s+['"]\.\.\/data\.js['"]/g, "from '../data/data.js'");
    }

    if (file.includes(path.join('src', 'components', 'dashboard')) || 
        file.includes(path.join('src', 'components', 'transactions')) ||
        file.includes(path.join('src', 'components', 'layout'))) {
        
        content = content.replace(/from\s+['"]\.\.\/redux/g, "from '../../redux");
        content = content.replace(/from\s+['"]\.\/ui/g, "from '../ui");
        content = content.replace(/from\s+['"]\.\.\/data\.js['"]/g, "from '../../data/data.js'");
    }

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

// App.jsx special treatment
replaceInFile(path.join(srcDir, 'App.jsx'), [
    { search: /from '\.\/components\/Dashboard'/g, replace: "from './pages/Dashboard'" },
    { search: /from '\.\/components\/TransactionsPage'/g, replace: "from './pages/TransactionsPage'" },
    { search: /from '\.\/components\/BudgetsPage'/g, replace: "from './pages/BudgetsPage'" },
    { search: /from '\.\/components\/AnalyticsPage'/g, replace: "from './pages/AnalyticsPage'" },
    { search: /from '\.\/components\/SettingsPage'/g, replace: "from './pages/SettingsPage'" },
    { search: /from '\.\/components\/Navbar'/g, replace: "from './components/layout/Navbar'" },
    { search: /from '\.\/components\/Sidebar'/g, replace: "from './components/layout/Sidebar'" },
]);

// ThemeSwitcher import in Sidebar might be broken
replaceInFile(path.join(srcDir, 'components', 'layout', 'Sidebar.jsx'), [
    { search: /from '\.\/ThemeSwitcher'/g, replace: "from './ThemeSwitcher'" }
]);

console.log("Refactor complete.");
