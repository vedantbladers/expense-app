import { useState } from "react"
import { Paperclip, FileText, Calendar, Tag, DollarSign, User } from "lucide-react"

export default function NewExpensePage() {
  const [form, setForm] = useState({
    description: "",
    date: "",
    paidBy: "",
    category: "",
    remarks: "",
    amount: "",
    currency: "INR",
    receipt: null,
  })

  const paidByOptions = ["Self", "Company Card"]
  const categoryOptions = ["Travel", "Food", "Office Supplies", "Other"]
  const currencyOptions = ["INR", "USD", "EUR"]

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit logic here
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center pt-10">
      {/* Top Row: Attach Receipt + Draft Card */}
      <div className="flex gap-4 w-full max-w-2xl mb-6">
        <div className="flex flex-col flex-1">
          <label className="btn btn-outline flex gap-2 cursor-pointer">
            <Paperclip size={18} /> Attach Receipt
            <input
              type="file"
              name="receipt"
              className="hidden"
              onChange={handleChange}
              accept="image/*,.pdf"
            />
          </label>
          {/* Show file name and size if receipt is attached */}
          {form.receipt && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">{form.receipt.name}</span>
              <span className="ml-2">({(form.receipt.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}
        </div>
        <div className="card bg-base-100 shadow flex-1 flex flex-row items-center justify-between px-4 py-2">
          <span className="font-semibold text-sm">Draft: Waiting for upload</span>
          <span className="badge badge-warning">Draft</span>
        </div>
      </div>

      {/* Expense Form */}
      <form
        className="card bg-base-100 shadow w-full max-w-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="form-control">
          <label className="label font-semibold">
            <FileText size={16} className="mr-2" /> Description
          </label>
          <input
            type="text"
            name="description"
            className="input input-bordered"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <Calendar size={16} className="mr-2" /> Expense Date
          </label>
          <input
            type="date"
            name="date"
            className="input input-bordered"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <User size={16} className="mr-2" /> Paid By
          </label>
          <select
            name="paidBy"
            className="select select-bordered"
            value={form.paidBy}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {paidByOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <Tag size={16} className="mr-2" /> Category
          </label>
          <select
            name="category"
            className="select select-bordered"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="form-control md:col-span-2">
          <label className="label font-semibold pr-2.5">
            Remarks
          </label>
          <input
            type="text"
            name="remarks"
            className="input input-bordered"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>
        <div className="form-control flex flex-row gap-2 items-center md:col-span-2">
          <label className="label font-semibold">
            <DollarSign size={16} className="mr-2" /> Total Amount
          </label>
          <input
            type="number"
            name="amount"
            className="input input-bordered w-32"
            value={form.amount}
            onChange={handleChange}
            required
            min="0"
          />
          <select
            name="currency"
            className="select select-bordered w-28"
            value={form.currency}
            onChange={handleChange}
            required
          >
            {currencyOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full md:col-span-2 mt-4">
          Submit Expense
        </button>
      </form>
    </div>
  )
}