import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
import AppRouter from './routes/AppRouters'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
)
