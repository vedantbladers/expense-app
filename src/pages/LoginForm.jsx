import { useState } from "react";
import { User, Lock } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('Signing in...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        // Success toast
        toast.success(data.message || 'Login successful!', {
          duration: 4000,
          icon: '🎉',
        });

                // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');

        console.log('Login successful:', data.user);
        
        // Redirect based on user role
        setTimeout(() => {
          const user = data.user;
          switch(user.role) {
            case 'admin':
              window.location.href = '/admin-user-management';
              break;
            case 'manager':
              window.location.href = '/manager';
              break;
            case 'employee':
            default:
              window.location.href = '/employee';
              break;
          }
        }, 1500);
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        
      } else {
        // Error toast
        toast.error(data.message || 'Login failed!', {
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.dismiss(loadingToast);
      toast.error('Connection error. Please check if the server is running.', {
        duration: 5000,
        icon: '🔌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back!</h1>
        <p className="text-base text-gray-600">
          Log in to continue tracking your expenses.
        </p>
      </div>
      <div className="card w-full max-w-sm shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <User size={28} /> Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label font-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="input input-bordered"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              <Lock size={16} className="mr-2" /> Password
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
            <label className="label">
              <span className="label-text-alt"></span>
              <a href="/forgot-password" className="label-text-alt link link-hover link-primary">
                Forgot password?
              </a>
            </label>
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary w-full mt-2 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/signup" className="link link-primary">
            Don't have an account? Sign up
          </a>
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