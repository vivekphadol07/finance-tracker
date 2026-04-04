/**
 * Converts transaction data to CSV format and triggers a download.
 * @param {Array} transactions
 * @param {Object} options
 */
export const exportTransactionsToCSV = (transactions, options = {}) => {
  if (!transactions || transactions.length === 0) return false;

  const { filenamePrefix = 'FinaTracker_Transactions' } = options;

  const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Note'];
  const rows = transactions.map(t => [
    t.id,
    new Date(t.date).toLocaleDateString(),
    t.type.toUpperCase(),
    t.category,
    t.amount,
    t.note || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
