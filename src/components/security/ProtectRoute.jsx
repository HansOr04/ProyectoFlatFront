
import { Navigate } from 'react-router-dom';

// Componente ProtectedRoute actualizado
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    if (adminOnly && !user.isAdmin) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };
export default ProtectedRoute;