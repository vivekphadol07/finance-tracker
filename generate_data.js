const categories = {
  income: ['salary', 'freelance', 'investment', 'gift'],
  expense: ['food', 'travel', 'rent', 'shopping', 'healthcare', 'utilities', 'entertainment', 'other']
};

const notes = {
  salary: ['Monthly Salary', 'Bonus', 'Paycheck'],
  freelance: ['Web Dev Project', 'Consulting', 'Design Work'],
  food: ['Swiggy', 'Zomato', 'Groceries', 'Fine Dining', 'Coffee'],
  travel: ['Uber', 'Petrol', 'Bus Ticket', 'Flight'],
  rent: ['Rent Payment', 'Maintenance'],
  shopping: ['Amazon', 'Myntra', 'Clothing', 'Electronics'],
  entertainment: ['Netflix', 'Spotify', 'Cinema', 'Gaming']
};

const generateData = () => {
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < 80; i++) {
    const type = Math.random() > 0.8 ? 'income' : 'expense';
    const cats = categories[type];
    const category = cats[Math.floor(Math.random() * cats.length)];
    const noteList = notes[category] || ['Regular payment'];
    const note = noteList[Math.floor(Math.random() * noteList.length)];
    
    // Spread over last 4 months
    const date = new Date();
    date.setDate(now.getDate() - Math.floor(Math.random() * 120));
    
    const amount = type === 'income' 
      ? Math.floor(Math.random() * 5000) + 1000 
      : Math.floor(Math.random() * 800) + 50;

    transactions.push({
      id: i + 1,
      type,
      amount,
      convertedBase: amount,
      category,
      date: date.toISOString().split('T')[0],
      note
    });
  }

  // Sort by date descending
  transactions.sort((a,b) => new Date(b.date) - new Date(a.date));

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  return { transactions, summary: { income: totals.income, expense: totals.expense, balance: totals.income - totals.expense } };
};

const data = generateData();

console.log('export const transactions = ' + JSON.stringify(data.transactions, null, 2) + ';');
console.log('export const summary = ' + JSON.stringify(data.summary, null, 2) + ';');
