import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import About from './pages/About';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import AdminLogin from './pages/AdminLogin';
import CarsManagement from './pages/CarsManagement';
import CategoryManagement from './pages/CategoryManagement';
import ManufacturerManagement from './pages/ManufacturerManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && !isLoginRoute && <AdminNavbar />}
      <div 
        className={`${!isAdminRoute ? "pt-16" : ""} ${isAdminRoute && !isLoginRoute ? "pl-64" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Catalog" element={<Catalog />} />
          <Route path="/About" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/cars" 
            element={
              <ProtectedRoute>
                <CarsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/category" 
            element={
              <ProtectedRoute>
                <CategoryManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/manufacturer" 
            element={
              <ProtectedRoute>
                <ManufacturerManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

export default App;