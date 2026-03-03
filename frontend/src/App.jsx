import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Explore from './pages/Explore';
import Troubleshoot from './pages/Troubleshoot';
import Collaborate from './pages/Collaborate';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main App Component for EduGeneLearn
 *
 * Features:
 * - Genomic data upload and integration
 * - 3D visualizations
 * - AI-driven learning recommendations
 * - Natural language queries
 * - Real-time collaboration
 * - MBTI-tailored experience
 *
 * @author sekacorn
 * @version 1.0.0
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <Analyze />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/troubleshoot"
              element={
                <ProtectedRoute>
                  <Troubleshoot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collaborate"
              element={
                <ProtectedRoute>
                  <Collaborate />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
