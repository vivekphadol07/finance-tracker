// Mock API Service simulating network operations

const DELAY_MS = 500; // Simulated network delay

export const mockApi = {
  // Simulate fetching data with an optional delay and chance of failure
  fetch: async (key) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = localStorage.getItem(key);
          resolve(data ? JSON.parse(data) : null);
        } catch (error) {
          reject('Failed to parse from local storage');
        }
      }, DELAY_MS);
    });
  },

  // Simulate saving data 
  save: async (key, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(data));
        resolve({ success: true, data });
      }, DELAY_MS);
    });
  },

  // Example backend operation for specific transactions
  saveTransactions: async (transactions) => {
    return mockApi.save('mockTransactions', transactions);
  },

  fetchTransactions: async () => {
    const data = await mockApi.fetch('mockTransactions');
    return data || [];
  }
};
