/**
 * Converts transaction data to CSV format and triggers a download.
 * @param {Array} transactions
 * @param {Object} options
 */
const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/g;

const sanitizeFileName = (fileName) =>
  [...fileName]
    .filter((char) => char.charCodeAt(0) >= 32)
    .join('')
    .replace(INVALID_FILENAME_CHARS, '_')
    .trim();

const hasExtension = (fileName) => {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot > 0 && lastDot < fileName.length - 1;
};

const getDefaultExtension = (fileName) => {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot > 0 ? fileName.slice(lastDot) : '';
};

export const promptForFileName = (defaultFileName, promptMessage = 'Enter file name') => {
  const userInput = window.prompt(promptMessage, defaultFileName);
  if (userInput === null) return null;

  const cleanedInput = sanitizeFileName(userInput);
  if (!cleanedInput) return defaultFileName;

  const extension = getDefaultExtension(defaultFileName);
  if (extension && !hasExtension(cleanedInput)) {
    return `${cleanedInput}${extension}`;
  }

  return cleanedInput;
};

export const downloadBlobWithPrompt = (blob, options = {}) => {
  const { defaultFileName = 'download.txt', promptMessage = 'Enter file name' } = options;
  const selectedFileName = promptForFileName(defaultFileName, promptMessage);
  if (!selectedFileName) return false;

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', selectedFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};

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
  const defaultFileName = `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`;

  return downloadBlobWithPrompt(blob, {
    defaultFileName,
    promptMessage: 'Enter CSV file name'
  });
};
