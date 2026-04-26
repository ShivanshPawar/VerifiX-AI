import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import ScrollManager from './routes/ScrollManager'

const App = () => {
  return (
    <AuthProvider>
      <ScrollManager />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App