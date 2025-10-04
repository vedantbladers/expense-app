import { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import RoleBasedNavbar from '../components/RoleBasedNavbar';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Admin',
      manager: 'CEO',
      email: 'john@example.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Manager',
      manager: 'John Doe',
      email: 'jane@example.com',
    },
    {
      id: 3,
      name: 'Bob Wilson',
      role: 'User',
      manager: 'Jane Smith',
      email: 'bob@example.com',
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    role: '',
    email: '',
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.role || !newUser.email) {
      window.alert('Please fill in all fields');
      return;
    }

    const user = {
      id: users.length + 1,
      name: newUser.name,
      role: newUser.role,
      manager: 'To be assigned',
      email: newUser.email,
    };

    setUsers([...users, user]);
    setNewUser({ name: '', role: '', email: '' });

    window.alert('User created successfully');
  };

  const handleSendPassword = (user) => {
    window.alert(`Password reset email sent to ${user.email}`);
  };

  const handleFieldUpdate = (userId, field, value) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      <RoleBasedNavbar />
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Admin User Management
        </h1>

        {/* New User Form */}
        <div className="card bg-base-100 shadow-lg border border-base-300 mb-8">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5" />
              <span className="text-xl font-semibold">Create New User</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label font-semibold">User Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label font-semibold">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div>
                <label className="label font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateUser}
                  className="btn btn-primary w-full"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <div className="overflow-x-auto rounded-lg">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-300">
                    <th>User</th>
                    <th>Role</th>
                    <th>Manager</th>
                    <th>Email</th>
                    <th className="text-center">Send Password</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-base-200 transition">
                      <td>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            handleFieldUpdate(user.id, 'name', e.target.value)
                          }
                          className="input input-bordered w-full"
                        />
                      </td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleFieldUpdate(user.id, 'role', e.target.value)
                          }
                          className="select select-bordered w-full"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="User">User</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={user.manager}
                          onChange={(e) =>
                            handleFieldUpdate(user.id, 'manager', e.target.value)
                          }
                          className="input input-bordered w-full"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) =>
                            handleFieldUpdate(user.id, 'email', e.target.value)
                          }
                          className="input input-bordered w-full"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline btn-sm flex items-center gap-1"
                          onClick={() => handleSendPassword(user)}
                        >
                          <Mail className="h-4 w-4" />
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4 italic">
              * Can create a new user on the fly if not found
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
