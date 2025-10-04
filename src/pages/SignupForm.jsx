import { useState, useEffect } from "react";
import { UserPlus, Mail, Lock, Globe, User } from "lucide-react";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });
  const [countries, setCountries] = useState([]);

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
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
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
          <button type="submit" className="btn btn-primary w-full mt-2">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="link link-primary">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}