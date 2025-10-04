import { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, RefreshCw, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const data = await response.json();
        console.log('Users loaded from API:', data);
        // Add default values for missing fields
        const usersWithDefaults = data.map(user => ({
          ...user,
          role: user.role || 'employee',
          manager: user.manager || 'Not Assigned'
        }));
        setUsers(usersWithDefaults);
      } else {
        console.error('API failed with status:', response.status);
        setUsers([]);
        toast.error('Failed to load users from server');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      toast.error('Connection error. Please check if the server is running.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSendPassword = async (userEmail, userName) => {
    const loadingToast = toast.loading(`Generating new password for ${userName}...`);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          userName: userName 
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        // Show success message with generated password (for demo only)
        toast.success(
          <div>
            <p><strong>New password sent to {userName}!</strong></p>
            <p className="text-xs mt-1">Email: {userEmail}</p>
            {data.generatedPassword && (
              <p className="text-xs mt-1 font-mono bg-gray-100 p-1 rounded">
                Password: {data.generatedPassword}
              </p>
            )}
          </div>,
          {
            duration: 8000,
            icon: '�',
          }
        );
        
        console.log('Password updated for:', userName, 'New password:', data.generatedPassword);
      } else {
        toast.error(data.message || 'Failed to generate new password', {
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error sending password:', error);
      toast.dismiss(loadingToast);
      toast.error('Connection error. Please check if the server is running.', {
        duration: 4000,
        icon: '�',
      });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge-error';
      case 'manager': return 'badge-warning';
      case 'employee': return 'badge-info';
      default: return 'badge-neutral';
    }
  };



  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Password Management</h1>
          <p className="text-base text-gray-600">
            Generate new passwords and send them to users via email
          </p>
        </div>

        {/* Users Management Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <User size={24} /> User Management
              </h3>
              <button 
                onClick={loadUsers}
                className="btn btn-outline btn-sm"
                disabled={loadingUsers}
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="text-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">
                        <User size={16} className="inline mr-2" />
                        User
                      </th>
                      <th className="text-center">Role</th>
                      <th className="text-center">Manager</th>
                      <th className="text-center">
                        <Mail size={16} className="inline mr-2" />
                        Email
                      </th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-base-200">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Employee'}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-sm">
                            {user.manager || 'Not Assigned'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Mail size={14} />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline btn-sm btn-warning"
                            onClick={() => handleSendPassword(user.email, user.name)}
                          >
                            <Mail size={14} />
                            Generate & Send
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loadingUsers && users.length === 0 && (
              <div className="text-center py-8">
                <User size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No users found</p>
              </div>
            )}

            {/* Back to Login Button */}
            <div className="mt-6 text-center">
              <a href="/login" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Login
              </a>
            </div>
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