import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Dashboard from '@/pages/dashboard';
import Index from '@/pages/Index';
import UserManagement from '@/pages/usermanagement';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="user-manager-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/index" element={<Index />} />
                <Route path="/user/:id" element={<UserManagement />} />
              </Routes>
            </main>
          </div>

          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-card dark:text-foreground dark:border-border',
            }}
          />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
