import { useState, useEffect } from 'react'
import { FileText, Calendar, Tag, DollarSign, CheckCircle, Clock, User, RefreshCw } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'
import RoleBasedNavbar from '../components/RoleBasedNavbar'

export default function EmployeeProfilePage() {
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState({
    toSubmit: 0,
    waitingApproval: 0,
    approved: 0,
    currency: "USD"
  })

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
        calculateStatus(data);
      } else {
        toast.error('Failed to load expenses');
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Connection error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatus = (expenseData) => {
    const pending = expenseData.filter(exp => exp.status === 'pending');
    const approved = expenseData.filter(exp => exp.status === 'approved');
    const rejected = expenseData.filter(exp => exp.status === 'rejected');
    
    const pendingAmount = pending.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const approvedAmount = approved.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    setStatus({
      toSubmit: rejected.length, // Count of rejected expenses that need resubmission
      waitingApproval: pendingAmount,
      approved: approvedAmount,
      currency: "USD"
    });
  };

  // Status badge color
  const statusColor = (status) => {
    if (status === "approved") return "badge-success"
    if (status === "pending") return "badge-warning"
    if (status === "rejected") return "badge-error"
    return "badge"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <RoleBasedNavbar />
        <div className="flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <RoleBasedNavbar />
      
      {/* User Info Header */}
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <User size={32} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || 'Employee'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-outline">{user?.role || 'employee'}</span>
                  <span className="text-sm text-gray-500">{user?.country}</span>
                </div>
              </div>
              <div className="ml-auto">
                <button 
                  onClick={() => loadExpenses()}
                  className="btn btn-outline btn-sm"
                  disabled={isLoading}
                >
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4">
        <div className="card bg-base-100 shadow flex flex-col items-center p-4">
          <span className="text-lg font-semibold">Rejected</span>
          <span className="text-2xl font-bold flex items-center gap-1 text-error">
            <FileText size={20} /> {status.toSubmit}
          </span>
          <span className="text-xs text-gray-500">Need resubmission</span>
        </div>
        <div className="card bg-base-100 shadow flex flex-col items-center p-4">
          <span className="text-lg font-semibold">Pending</span>
          <span className="text-2xl font-bold flex items-center gap-1 text-warning">
            <Clock size={20} /> ${status.waitingApproval.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">Awaiting approval</span>
        </div>
        <div className="card bg-base-100 shadow flex flex-col items-center p-4">
          <span className="text-lg font-semibold">Approved</span>
          <span className="text-2xl font-bold flex items-center gap-1 text-success">
            <CheckCircle size={20} /> ${status.approved.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">Total approved</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="max-w-4xl mx-auto bg-base-100 shadow rounded-xl p-4 px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">My Expenses</h3>
          <div className="flex gap-2">
            <a href="/new" className="btn btn-primary btn-sm">
              <DollarSign size={16} /> New Expense
            </a>
          </div>
        </div>
        
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold mb-2">No Expenses Yet</h4>
            <p className="text-gray-500 mb-4">Start by creating your first expense report</p>
            <a href="/new" className="btn btn-primary">
              <DollarSign size={16} /> Create First Expense
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th><FileText size={16} /> Description</th>
                  <th><Calendar size={16} /> Date</th>
                  <th><Tag size={16} /> Category</th>
                  <th><User size={16} /> Paid By</th>
                  <th>Remarks</th>
                  <th><DollarSign size={16} /> Amount</th>
                  <th>Status</th>
                  <th>Reviewed By</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, idx) => (
                  <tr key={exp.id || idx} className="hover:bg-base-200">
                    <td className="font-medium">{exp.description}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-outline">{exp.category}</span>
                    </td>
                    <td>{exp.paidBy}</td>
                    <td className="max-w-xs truncate">{exp.remarks || '-'}</td>
                    <td className="font-semibold">${parseFloat(exp.amount).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${statusColor(exp.status)}`}>
                        {exp.status || 'pending'}
                      </span>
                    </td>
                    <td className="text-sm">
                      {exp.reviewed_by ? (
                        <div>
                          <div className="font-medium">{exp.reviewed_by}</div>
                          {exp.reviewed_at && (
                            <div className="text-xs text-gray-500">
                              {new Date(exp.reviewed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  )
}
