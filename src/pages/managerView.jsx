import { useState } from "react"
import { BadgeCheck, BadgeX, User, DollarSign, Tag } from "lucide-react"

export default function ApprovalsReview() {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      owner: "Sarah",
      subject: "Lunch with client",
      category: "Food",
      amount: "567",
      currency: "USD",
      convertedAmount: "49846 INR",
      badges: ["High Value"],
      status: "Approved"
    },
    {
      id: 2,
      owner: "John",
      subject: "Hotel Stay",
      category: "Travel",
      amount: "1200",
      currency: "USD",
      convertedAmount: "105400 INR",
      badges: ["Urgent"],
      status: "Pending"
    },
    {
      id: 3,
      owner: "Mike",
      subject: "Stationery",
      category: "Office Supplies",
      amount: "50",
      currency: "USD",
      convertedAmount: "4400 INR",
      badges: [],
      status: "Rejected"
    }
  ])

  const statusIcon = (status) => {
    if (status === "Approved")
      return <BadgeCheck size={22} className="text-success" title="Approved" />
    if (status === "Rejected")
      return <BadgeX size={22} className="text-error" title="Rejected" />
    return (
      <svg width="22" height="22" className="text-warning" title="Pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>
    )
  }

  const handleApprove = (id) => {
    setApprovals(approvals.map(app =>
      app.id === id ? { ...app, status: "Approved" } : app
    ))
  }

  const handleReject = (id) => {
    setApprovals(approvals.map(app =>
      app.id === id ? { ...app, status: "Rejected" } : app
    ))
  }

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center flex items-center justify-center gap-2">
          <Tag size={32} /> Manager Approvals
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center"><User size={16} /> Employee</th>
                <th className="text-center">Subject</th>
                <th className="text-center"><Tag size={16} /> Category</th>
                <th className="text-center"><DollarSign size={16} /> Amount</th>
                <th className="text-center">Converted</th>
                <th className="text-center">Badges</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((app, idx) => (
                <tr key={app.id} className="hover:bg-base-100 transition">
                  <td className="text-center font-bold">{idx + 1}</td>
                  <td className="text-center font-semibold">{app.owner}</td>
                  <td className="text-center">{app.subject}</td>
                  <td className="text-center">{app.category}</td>
                  <td className="text-center">{app.amount} {app.currency}</td>
                  <td className="text-center">{app.convertedAmount}</td>
                  <td className="text-center">
                    {app.badges.length > 0 ? (
                      app.badges.map((badge, i) => (
                        <span key={i} className="mr-1 text-warning font-semibold">{badge}</span>
                      ))
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="text-center">
                    {statusIcon(app.status)}
                  </td>
                  <td className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="btn btn-success btn-xs flex gap-1"
                        disabled={app.status === "Approved"}
                        onClick={() => handleApprove(app.id)}
                      >
                        <BadgeCheck size={16} />
                      </button>
                      <button
                        className="btn btn-error btn-xs flex gap-1"
                        disabled={app.status === "Rejected"}
                        onClick={() => handleReject(app.id)}
                      >
                        <BadgeX size={16} />
                      </button>
                    </div>
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