import { useState, useEffect } from 'react';
import { User, LogOut, UserCheck, Settings, BarChart3, Receipt, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoleBasedNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    toast.success('Logged out successfully!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  const getNavItems = () => {
    if (!user) return [];

    const commonItems = [
      { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
      { href: '/new', icon: Receipt, label: 'New Expense' },
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...commonItems,
          { href: '/admin-user-management', icon: Users, label: 'User Management' },
          { href: '/admin-approval-rules', icon: Settings, label: 'Approval Rules' },
          { href: '/manager', icon: UserCheck, label: 'Manager View' },
        ];
      case 'manager':
        return [
          ...commonItems,
          { href: '/manager', icon: UserCheck, label: 'Approvals' },
          { href: '/employee', icon: User, label: 'My Profile' },
        ];
      case 'employee':
      default:
        return [
          ...commonItems,
          { href: '/employee', icon: User, label: 'My Profile' },
        ];
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-error';
      case 'manager': return 'badge-warning';
      case 'employee': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👑';
      case 'manager': return '👔';
      case 'employee': return '👤';
      default: return '❓';
    }
  };

  if (!user) return null;

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {getNavItems().map((item, index) => (
              <li key={index}>
                <a href={item.href} className="flex items-center gap-2">
                  <item.icon size={16} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a href="/dashboard" className="btn btn-ghost text-xl">💼 Expense Tracker</a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {getNavItems().map((item, index) => (
            <li key={index}>
              <a href={item.href} className="flex items-center gap-2">
                <item.icon size={16} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`badge ${getRoleColor(user.role)} badge-sm`}>
              {getRoleIcon(user.role)} {user.role}
            </span>
            <span className="text-sm font-medium hidden md:inline">{user.name}</span>
          </div>
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user.name}</span>
                <span className="text-xs opacity-60">{user.email}</span>
              </li>
              <li><a href="/employee">👤 Profile</a></li>
              <li><a>⚙️ Settings</a></li>
              <div className="divider my-0"></div>
              <li><a onClick={handleLogout} className="text-error">
                <LogOut size={16} /> Logout
              </a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}