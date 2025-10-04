import { useState, useEffect } from "react"
import { BadgeCheck, BadgeX, User, DollarSign, Tag, RefreshCw } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'
import RoleBasedNavbar from '../components/RoleBasedNavbar'

export default function ApprovalsReview() {
  const [approvals, setApprovals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      console.log('Manager logged in:', user);
    } else {
      console.log('No user data found in localStorage');
    }
    
    console.log('Manager view mounting, loading expenses...');
    loadExpenses();
  }, [])

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setApprovals(data);
        console.log('Loaded expenses for manager:', data);
        console.log('Number of expenses:', data.length);
        if (data.length > 0) {
          console.log('First expense status:', data[0].status);
        }
      } else {
        console.error('Failed to load expenses, status:', response.status);
        toast.error('Failed to load expenses');
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Connection error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  const statusIcon = (status) => {
    if (status === "approved")
      return <BadgeCheck size={22} className="text-success" title="Approved" />
    if (status === "rejected")
      return <BadgeX size={22} className="text-error" title="Rejected" />
    return (
      <svg width="22" height="22" className="text-warning" title="Pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>
    )
  }

  const handleStatusUpdate = async (id, status) => {
    const loadingToast = toast.loading(`${status === 'approved' ? 'Approving' : 'Rejecting'} expense...`);

    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          reviewedBy: currentUser?.name || 'Manager'
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        // Update local state
        setApprovals(approvals.map(app =>
          app.id === id ? { 
            ...app, 
            status: status,
            reviewed_by: currentUser?.name || 'Manager',
            reviewed_at: new Date().toISOString()
          } : app
        ));

        toast.success(data.message, {
          icon: status === 'approved' ? '✅' : '❌',
          duration: 3000,
        });
      } else {
        toast.error(data.message || 'Failed to update expense status', {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error updating expense status:', error);
      toast.dismiss(loadingToast);
      toast.error('Connection error. Please try again.', {
        duration: 4000,
      });
    }
  };

  const handleApprove = (id) => {
    handleStatusUpdate(id, 'approved');
  }

  const handleReject = (id) => {
    handleStatusUpdate(id, 'rejected');
  }

  const getBadges = (expense) => {
    const badges = [];
    const amount = parseFloat(expense.amount);
    
    if (amount > 500) badges.push('High Value');
    if (expense.status === 'pending') badges.push('Pending Review');
    if (new Date(expense.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      badges.push('Recent');
    }
    
    return badges;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-lg">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <RoleBasedNavbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Tag size={32} /> Manager Approvals
          </h2>
          <div className="flex gap-2">
            <div className="text-sm text-gray-500">
              User: {currentUser?.email || 'Loading...'}
            </div>
            <button 
              onClick={loadExpenses}
              className="btn btn-outline btn-sm"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {approvals.length === 0 ? (
          <div className="card bg-base-100 shadow">
            <div className="card-body text-center py-16">
              <Tag size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No Expenses Found</h3>
              <p className="text-gray-500">There are no expense reports to review at this time.</p>
              <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
                <h4 className="font-bold mb-2">🔍 Debug Info:</h4>
                <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                <p><strong>Approvals Array Length:</strong> {approvals.length}</p>
                <p><strong>Current User:</strong> {currentUser?.name || 'Not loaded'}</p>
                <p><strong>User Email:</strong> {currentUser?.email || 'Not loaded'}</p>
                <p><strong>User Role:</strong> {currentUser?.role || 'Not loaded'}</p>
                <p><strong>Raw Approvals Data:</strong></p>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                  {JSON.stringify(approvals, null, 2)}
                </pre>
              </div>
              <button 
                onClick={loadExpenses}
                className="btn btn-outline btn-sm mt-4"
              >
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-300">
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center"><User size={16} /> Employee</th>
                      <th className="text-center">Description</th>
                      <th className="text-center"><Tag size={16} /> Category</th>
                      <th className="text-center"><DollarSign size={16} /> Amount</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Badges</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Reviewed By</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((app, idx) => {
                      const badges = getBadges(app);
                      return (
                        <tr key={app.id} className="hover:bg-base-100 transition">
                          <td className="text-center font-bold">{idx + 1}</td>
                          <td className="text-center font-semibold">{app.paidBy}</td>
                          <td className="text-center max-w-xs truncate" title={app.description}>
                            {app.description}
                          </td>
                          <td className="text-center">
                            <span className="badge badge-outline">{app.category}</span>
                          </td>
                          <td className="text-center font-semibold">
                            {app.currency} {parseFloat(app.amount).toFixed(2)}
                          </td>
                          <td className="text-center">
                            {new Date(app.date).toLocaleDateString()}
                          </td>
                          <td className="text-center">
                            {badges.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {badges.map((badge, i) => (
                                  <span key={i} className="badge badge-warning badge-xs">
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {statusIcon(app.status)}
                          </td>
                          <td className="text-center text-sm">
                            {app.reviewed_by ? (
                              <div>
                                <div className="font-medium">{app.reviewed_by}</div>
                                <div className="text-xs text-gray-500">
                                  {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : ''}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-success btn-xs flex gap-1"
                                disabled={app.status === "approved"}
                                onClick={() => handleApprove(app.id)}
                                title="Approve"
                              >
                                <BadgeCheck size={14} />
                              </button>
                              <button
                                className="btn btn-error btn-xs flex gap-1"
                                disabled={app.status === "rejected"}
                                onClick={() => handleReject(app.id)}
                                title="Reject"
                              >
                                <BadgeX size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Total Expenses</div>
            <div className="stat-value text-primary">{approvals.length}</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{approvals.filter(a => a.status === 'pending').length}</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Approved</div>
            <div className="stat-value text-success">{approvals.filter(a => a.status === 'approved').length}</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Rejected</div>
            <div className="stat-value text-error">{approvals.filter(a => a.status === 'rejected').length}</div>
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
  )
}