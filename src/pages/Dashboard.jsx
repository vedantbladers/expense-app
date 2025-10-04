import { useState, useEffect } from 'react';
import { Plus, Receipt, BarChart3 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import RoleBasedNavbar from '../components/RoleBasedNavbar';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data (authentication is handled by ProtectedRoute)
    const userData = localStorage.getItem('user');
    setUser(JSON.parse(userData));
    loadExpenses();

    // Auto-refresh expenses every 30 seconds to show real-time updates
    const interval = setInterval(() => {
      loadExpenses(true); // Show toasts for status changes
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadExpenses = async (showToast = false) => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses');
      if (response.ok) {
        const newData = await response.json();
        
        // Check for status changes if this is a refresh
        if (expenses.length > 0 && showToast) {
          const statusChanges = newData.filter(newExpense => {
            const oldExpense = expenses.find(e => e.id === newExpense.id);
            return oldExpense && oldExpense.status !== newExpense.status;
          });

          statusChanges.forEach(expense => {
            if (expense.status === 'approved') {
              toast.success(`Your expense "${expense.description}" has been approved! 🎉`, {
                duration: 5000,
              });
            } else if (expense.status === 'rejected') {
              toast.error(`Your expense "${expense.description}" has been rejected.`, {
                duration: 5000,
              });
            }
          });
        }
        
        setExpenses(newData);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      if (showToast) {
        toast.error('Failed to refresh expenses');
      }
    } finally {
      setIsLoading(false);
    }
  };



  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <RoleBasedNavbar />

      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-gray-600">Here's an overview of your expense management.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-primary">
              <Receipt size={32} />
            </div>
            <div className="stat-title">Total Expenses</div>
            <div className="stat-value">{expenses.length}</div>
            <div className="stat-desc">All time</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-secondary">
              <BarChart3 size={32} />
            </div>
            <div className="stat-title">Total Amount</div>
            <div className="stat-value">${totalAmount.toFixed(2)}</div>
            <div className="stat-desc">All expenses</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-accent">
              <User size={32} />
            </div>
            <div className="stat-title">Account</div>
            <div className="stat-value text-sm">{user?.email}</div>
            <div className="stat-desc">{user?.country}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/new" className="btn btn-primary">
              <Plus size={20} /> New Expense
            </a>
            <a href="/table" target="_blank" className="btn btn-secondary">
              <BarChart3 size={20} /> View Table
            </a>
            <button className="btn btn-accent" onClick={() => loadExpenses(true)}>
              🔄 Refresh Data
            </button>
            <a href="/employee" className="btn btn-outline">
              <User size={20} /> Profile
            </a>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title mb-4">Recent Expenses</h3>
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No expenses found</p>
                <a href="/new" className="btn btn-primary mt-4">
                  <Plus size={16} /> Add Your First Expense
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.slice(0, 5).map((expense) => (
                      <tr key={expense.id}>
                        <td className="font-medium">{expense.description}</td>
                        <td>${parseFloat(expense.amount).toFixed(2)}</td>
                        <td>
                          <span className="badge badge-outline">{expense.category}</span>
                        </td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            expense.status === 'approved' ? 'badge-success' :
                            expense.status === 'rejected' ? 'badge-error' :
                            'badge-warning'
                          }`}>
                            {expense.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {expenses.length > 5 && (
                  <div className="text-center mt-4">
                    <a href="/table" target="_blank" className="btn btn-outline">
                      View All {expenses.length} Expenses
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </div>
  );
}