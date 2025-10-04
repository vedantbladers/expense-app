import { BrowserRouter, Routes, Route } from "react-router-dom"
import EmployeeProfilePage from "./pages/empProfilePage"
import NewExpensePage from "./pages/NEWreceipt"
import LoginForm from "./pages/LoginForm"
import SignupForm from "./pages/SignupForm"
import ApprovalsReview from "./pages/managerView"
import AdminApprovalRules from "./pages/AdminApprovalRules"
import AdminUserManagement from "./pages/AdminUserManagement"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/employee" element={<EmployeeProfilePage />} />
        <Route path="/new" element={<NewExpensePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/manager" element={<ApprovalsReview />} />
        <Route path="/admin-approval-rules" element={<AdminApprovalRules />} />
        <Route path="/admin-user-management" element={<AdminUserManagement />} />
      </Routes>
    </BrowserRouter> 
  )
}
