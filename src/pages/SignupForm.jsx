import { useState, useEffect } from "react";
import { UserPlus, Mail, Lock, Globe, User } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    role: "",
  });
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,currencies")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data
          .map((c) => ({
            name: c.name.common,
            currency: Object.keys(c.currencies || {})[0] || "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load countries list');
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        icon: '🔒',
      });
      setIsLoading(false);
      return;
    }

    if (!form.role) {
      toast.error('Please select your role', {
        icon: '👤',
      });
      setIsLoading(false);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
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
        toast.success(data.message || 'Account created successfully!', {
          duration: 5000,
          icon: '🎉',
        });

        // Clear form
        setForm({
          name: "",
          email: "",
          password: "",
          country: "",
          role: "",
        });

        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');

        console.log('Signup successful:', data.user);
        
        // Redirect based on role after successful signup
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
        }, 2000);
        
      } else {
        // Error toast
        toast.error(data.message || 'Signup failed!', {
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
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
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome to Expense Tracker!
        </h1>
        <p className="text-base text-gray-600">
          Create your account to get started managing your expenses.
        </p>
      </div>
      <div className="card w-full max-w-sm shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <UserPlus size={28} /> Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label font-semibold flex items-center gap-2">
              <User size={16} /> Name
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              <Mail size={16} className="mr-2" /> Email
            </label>
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
              placeholder="Create a password"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold flex items-center gap-2">
              <Globe size={16} /> Country
            </label>
            <select
              name="country"
              className="select select-bordered"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              {countries.map((c, idx) => (
                <option key={idx} value={c.name}>
                  {c.name} {c.currency ? `(${c.currency})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label font-semibold flex items-center gap-2">
              <UserPlus size={16} /> Role
            </label>
            <select
              name="role"
              className="select select-bordered"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select your role</option>
              <option value="employee">👤 Employee</option>
              <option value="manager">👔 Manager</option>
              <option value="admin">👑 Administrator</option>
            </select>
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary w-full mt-2 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="link link-primary">
            Already have an account? Login
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