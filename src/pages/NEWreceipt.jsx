import { useState } from "react"
import { Paperclip, FileText, Calendar, Tag, DollarSign, User } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'
import RoleBasedNavbar from '../components/RoleBasedNavbar'

export default function NewExpensePage() {
  const [form, setForm] = useState({
    description: "",
    date: "",
    paidBy: "",
    category: "",
    remarks: "",
    amount: "",
    currency: "USD",
    receipt: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [isParsingReceipt, setIsParsingReceipt] = useState(false)

  const paidByOptions = ["Self", "Company Card"]
  const categoryOptions = ["Travel", "Meals", "Office", "Software", "Equipment", "Other"]
  const currencyOptions = ["USD", "EUR", "INR", "GBP"]

  const handleChange = async (e) => {
    const { name, value, files } = e.target
    
    if (name === 'receipt' && files && files[0]) {
      const file = files[0]
      setForm({
        ...form,
        [name]: file,
      })
      
      // Parse the receipt automatically when uploaded
      await parseReceipt(file)
    } else {
      setForm({
        ...form,
        [name]: value,
      })
    }
  }

  const parseReceipt = async (file) => {
    setIsParsingReceipt(true)
    setParsedData(null)
    
    const parseToast = toast.loading('Analyzing receipt...', {
      icon: '🔍',
    })

    try {
      const formData = new FormData()
      formData.append('receipt', file)

      const response = await fetch('http://localhost:5000/api/parse-receipt', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      toast.dismiss(parseToast)

      if (result.success && result.data) {
        setParsedData(result.data)
        
        // Auto-fill form with parsed data
        const parsedDate = result.data.date ? result.data.date : ''
        const parsedAmount = result.data.total ? result.data.total.toString() : ''
        const parsedDescription = result.data.merchant_name || ''
        
        setForm(prev => ({
          ...prev,
          description: parsedDescription || prev.description,
          date: parsedDate || prev.date,
          amount: parsedAmount || prev.amount,
          currency: result.data.currency || prev.currency,
        }))

        toast.success('Receipt analyzed successfully!', {
          duration: 4000,
          icon: '✅',
        })
      } else {
        toast.error(result.error || 'Failed to analyze receipt', {
          duration: 4000,
          icon: '❌',
        })
      }
    } catch (error) {
      console.error('Receipt parsing error:', error)
      toast.dismiss(parseToast)
      toast.error('Error analyzing receipt. Please try again.', {
        duration: 4000,
        icon: '🔌',
      })
    } finally {
      setIsParsingReceipt(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!form.description || !form.date || !form.paidBy || !form.category || !form.amount) {
      toast.error('Please fill in all required fields', {
        icon: '📝',
      })
      setIsLoading(false)
      return
    }

    if (parseFloat(form.amount) <= 0) {
      toast.error('Amount must be greater than 0', {
        icon: '💰',
      })
      setIsLoading(false)
      return
    }

    // Show loading toast
    const loadingToast = toast.loading('Submitting expense...')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('description', form.description)
      formData.append('date', form.date)
      formData.append('paidBy', form.paidBy)
      formData.append('category', form.category)
      formData.append('remarks', form.remarks)
      formData.append('amount', form.amount)
      formData.append('currency', form.currency)
      
      if (form.receipt) {
        formData.append('receipt', form.receipt)
      }

      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (response.ok) {
        // Success toast
        toast.success('Expense submitted successfully!', {
          duration: 5000,
          icon: '🎉',
        })

        // Reset form
        setForm({
          description: "",
          date: "",
          paidBy: "",
          category: "",
          remarks: "",
          amount: "",
          currency: "USD",
          receipt: null,
        })

        console.log('Expense submitted:', data)
        
      } else {
        // Error toast
        toast.error(data.error || 'Failed to submit expense!', {
          duration: 4000,
          icon: '❌',
        })
      }
    } catch (error) {
      console.error('Expense submission error:', error)
      toast.dismiss(loadingToast)
      toast.error('Connection error. Please check if the server is running.', {
        duration: 5000,
        icon: '🔌',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <RoleBasedNavbar />
      <div className="flex flex-col items-center pt-10">
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
          <span className="font-semibold text-sm">
            {isParsingReceipt ? "Analyzing receipt..." : 
             parsedData ? "Receipt analyzed successfully" : 
             "Draft: Waiting for upload"}
          </span>
          <span className={`badge ${
            isParsingReceipt ? 'badge-info' : 
            parsedData ? 'badge-success' : 
            'badge-warning'
          }`}>
            {isParsingReceipt ? 'Processing' : 
             parsedData ? 'Analyzed' : 
             'Draft'}
          </span>
        </div>
      </div>

      {/* Parsed Receipt Data Display */}
      {parsedData && (
        <div className="card bg-base-100 shadow w-full max-w-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Extracted Receipt Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedData.merchant_name && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Merchant</span>
                <span className="text-base">{parsedData.merchant_name}</span>
              </div>
            )}
            {parsedData.date && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Date</span>
                <span className="text-base">{parsedData.date}</span>
              </div>
            )}
            {parsedData.total && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Total Amount</span>
                <span className="text-base">
                  {parsedData.currency || 'USD'} {parsedData.total}
                </span>
              </div>
            )}
            {parsedData.tax && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Tax</span>
                <span className="text-base">
                  {parsedData.currency || 'USD'} {parsedData.tax}
                </span>
              </div>
            )}
          </div>
          
          {/* Items breakdown */}
          {parsedData.items && parsedData.items.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600 block mb-2">Items</span>
              <div className="space-y-2">
                {parsedData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">
                      {parsedData.currency || 'USD'} {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📝 The form below has been automatically filled with the extracted data. 
              Please review and modify as needed before submitting.
            </p>
          </div>
        </div>
      )}

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
        <button 
          type="submit" 
          className={`btn btn-primary w-full md:col-span-2 mt-4 ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Expense'}
        </button>
      </form>
      
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
    </div>
  )
}