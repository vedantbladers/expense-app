import { useState } from "react";
import { User, Lock } from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
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
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/signup" className="link link-primary">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}