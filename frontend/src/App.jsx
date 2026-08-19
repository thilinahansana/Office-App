import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormDataPage from './pages/FormDataPage';
import MonthlyWorkPage from './pages/MonthlyWorkPage';
import EntrepreneursPage from './pages/EntrepreneursPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form-data"
            element={
              <ProtectedRoute>
                <FormDataPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monthly-work"
            element={
              <ProtectedRoute>
                <MonthlyWorkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entrepreneurs"
            element={
              <ProtectedRoute>
                <EntrepreneursPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
