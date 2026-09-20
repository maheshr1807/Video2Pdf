import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Processing from './pages/Processing';
import Result from './pages/Result';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>

        <Footer />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(30, 27, 75, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#e2e8f0',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </Router>
  );
}
