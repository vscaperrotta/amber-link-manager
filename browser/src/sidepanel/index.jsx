import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@contexts/AuthContext.jsx';
import '@styles/main.scss';
import App from './App.jsx'

document.documentElement.setAttribute('data-theme', 'dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
