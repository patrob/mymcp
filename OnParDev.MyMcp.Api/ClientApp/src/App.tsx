import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigurationProvider } from '@/contexts/ConfigurationContext'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import Dashboard from '@/pages/Dashboard'
import Landing from '@/pages/Landing'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <ConfigurationProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              } 
            />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ConfigurationProvider>
  )
}

export default App