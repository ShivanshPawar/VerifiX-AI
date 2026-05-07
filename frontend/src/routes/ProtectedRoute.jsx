import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { ready, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!ready) return null

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
