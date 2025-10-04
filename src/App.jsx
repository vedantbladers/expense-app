import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import EmployeeProfilePage from "./pages/empProfilePage"
import NewExpensePage from "./pages/NEWreceipt"
import LoginForm from "./pages/LoginForm"
import SignupForm from "./pages/SignupForm"
import ForgotPassword from "./pages/forgotPassword"
import ApprovalsReview from "./pages/managerView"
import AdminApprovalRules from "./pages/AdminApprovalRules"
import AdminUserManagement from "./pages/AdminUserManagement"
import Dashboard from "./pages/Dashboard"

// Protected Route Component
function ProtectedRoute({ children }) {
  const userData = localStorage.getItem('user');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (!userData || !isLoggedIn) {
    return <Navigate to="/signup" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee" element={
          <ProtectedRoute>
            <EmployeeProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/new" element={
          <ProtectedRoute>
            <NewExpensePage />
          </ProtectedRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute>
            <ApprovalsReview />
          </ProtectedRoute>
        } />
        <Route path="/admin-approval-rules" element={
          <ProtectedRoute>
            <AdminApprovalRules />
          </ProtectedRoute>
        } />
        <Route path="/admin-user-management" element={
          <ProtectedRoute>
            <AdminUserManagement />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter> 
  )
}
