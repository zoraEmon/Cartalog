import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get('token');
  const storedToken = localStorage.getItem('adminToken');
  
  const isAuthenticated = storedToken && localStorage.getItem('isAdminAuthenticated') === 'true';

  // If there's a token in the URL and it's different from stored token, update storage
  if (tokenFromUrl && tokenFromUrl !== storedToken) {
    localStorage.setItem('adminToken', tokenFromUrl);
    localStorage.setItem('isAdminAuthenticated', 'true');
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 