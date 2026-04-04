import TransactionForm from '../components/transactions/TransactionForm';
import TransactionsList from '../components/transactions/TransactionsList';
import Card from '../components/ui/Card';

const TransactionsPage = () => {
  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in-up md:px-4 lg:px-20 max-w-7xl mx-auto">
      {/* 1st Card: Add New Transaction (Top) */}
      <div className="w-full">
        <Card title="Register New Transaction">
          <TransactionForm />
        </Card>
      </div>

      {/* 2nd Card: Transaction History (Bottom) */}
      <div className="w-full">
        <Card title="Historical Spending Records">
          <TransactionsList />
        </Card>
      </div>
    </div>
  );
};

export default TransactionsPage;
