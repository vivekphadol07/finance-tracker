import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importTransactions, selectTransactions } from '../redux/Slices/transactionsSlice';
import { toast } from 'sonner';
import { Upload, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { downloadBlobWithPrompt } from '../utils/exportUtils';

export const DataManagement = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const fileInputRef = React.useRef(null);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });

    const exported = downloadBlobWithPrompt(blob, {
      defaultFileName: 'transactions.json',
      promptMessage: 'Enter JSON file name'
    });

    if (exported) {
      toast.success('Exported to JSON successfully!');
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export.');
      return;
    }
    const headers = Object.keys(transactions[0]).join(',');
    const rows = transactions.map(t => Object.values(t).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const exported = downloadBlobWithPrompt(blob, {
      defaultFileName: 'transactions.csv',
      promptMessage: 'Enter CSV file name'
    });

    if (exported) {
      toast.success('Exported to CSV successfully!');
    }
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          dispatch(importTransactions(importedData));
          toast.success('Imported transactions successfully!');
        } else {
          toast.error('Invalid JSON format.');
        }
      } catch {
        toast.error('Failed to parse JSON.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = null;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm">
      <Button variant="secondary" onClick={handleExportJSON} className="py-1.5 px-3 text-xs gap-1">
        <Download className="w-4 h-4" /> Export JSON
      </Button>
      <Button variant="secondary" onClick={handleExportCSV} className="py-1.5 px-3 text-xs gap-1">
        <Download className="w-4 h-4" /> Export CSV
      </Button>

      <div className="relative">
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImportJSON} 
        />
        <Button variant="secondary" onClick={() => fileInputRef.current.click()} className="py-1.5 px-3 text-xs gap-1">
          <Upload className="w-4 h-4" /> Import JSON
        </Button>
      </div>
    </div>
  );
};
