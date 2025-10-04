import { Upload, Plus, User, FileText, Calendar, Tag, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"

export default function EmployeeProfilePage() {
  // Dummy data for demonstration
  const employee = {
    name: "John Employee",
    email: "john@example.com",
    role: "Employee",
    company: "Acme Corp",
    manager: "Sarah Manager",
  }

  const status = {
    toSubmit: 1200,
    waitingApproval: 800,
    approved: 5000,
    currency: "INR"
  }

  const expenses = [
    {
      description: "Hotel Stay",
      date: "2025-10-01",
      category: "Travel",
      paidBy: "Self",
      remarks: "Conference trip",
      amount: 1200,
      status: "Waiting Approval"
    },
    {
      description: "Lunch",
      date: "2025-09-28",
      category: "Food",
      paidBy: "Self",
      remarks: "Client meeting",
      amount: 500,
      status: "Approved"
    }
  ]

  // Status badge color
  const statusColor = (status) => {
    if (status === "Approved") return "badge-success"
    if (status === "Waiting Approval") return "badge-warning"
    if (status === "Rejected") return "badge-error"
    return "badge"
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow mb-6">
        <div className="flex-1">
          <span className="text-xl font-bold flex items-center gap-2">
            <User size={24} /> {employee.name}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm flex gap-2">
            <Upload size={18} /> Upload
          </button>
          <button className="btn btn-primary btn-sm flex gap-2">
            <Plus size={18} /> New
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-base-100 shadow flex flex-col items-center p-4">
          <span className="text-lg font-semibold">To Submit</span>
          <span className="text-2xl font-bold flex items-center gap-1">
            <DollarSign size={20} /> {status.toSubmit} {status.currency}
          </span>
        </div>
        <div className="card bg-base-100 shadow flex flex-col items-center p-4">
          <span className="text-lg font-semibold">Waiting Approval</span>
          <span className="text-2xl font-bold flex items-center gap-1">
            <Clock size={20} /> {status.waitingApproval} {status.currency}
          </span>
        </div>
        <div className="card bg-base-100 shadow flex flex-col items-center p-4">
          <span className="text-lg font-semibold">Approved</span>
          <span className="text-2xl font-bold flex items-center gap-1">
            <CheckCircle size={20} /> {status.approved} {status.currency}
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="max-w-4xl mx-auto bg-base-100 shadow rounded-xl p-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th><FileText size={16} /> Description</th>
                <th><Calendar size={16} /> Date</th>
                <th><Tag size={16} /> Category</th>
                <th><User size={16} /> Paid By</th>
                <th>Remarks</th>
                <th><DollarSign size={16} /> Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, idx) => (
                <tr key={idx}>
                  <td>{exp.description}</td>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                  <td>{exp.paidBy}</td>
                  <td>{exp.remarks}</td>
                  <td>{exp.amount} {status.currency}</td>
                  <td>
                    <span className={`badge ${statusColor(exp.status)}`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
