import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-right" />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;