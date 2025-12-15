import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute component - Bảo vệ các route yêu cầu authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con cần được bảo vệ
 * @returns {React.ReactNode} - Render children nếu đã đăng nhập, Navigate to login nếu chưa
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return <Navigate to="/auth" replace />
  }

  return children
}
