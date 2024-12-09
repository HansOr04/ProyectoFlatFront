<<<<<<< HEAD
import React from "react";
// import LoginAndSecurity from "./pages/LoginAndSecurity";
// import Notifications from "./pages/Notifications";
// import LoginRegisterPage from "./pages/LoginRegisterPage";
// import ProfileUpdate from "./pages/ProfileUpdate";
// import DetailsFlatPage from "./pages/DetailsFlatPage";
// import CreateFlat from "./pages/CreateFlat";
// import FavoriteFlat from "./pages/FavoriteFlat";
// import AllUsers from "./pages/AllUsers";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <div>
      {/* <LoginRegisterPage /> */}
      {/* <ProfileUpdate /> */}
      {/* <DetailsFlatPage /> */}
      {/* <CreateFlat /> */}
      {/* <FavoriteFlat /> */}
      {/* <AllUsers /> */}
      {/* <LoginAndSecurity /> */}
      {/* <Notifications /> */}
      <ResetPassword />
    </div>
  );
}

export default App;
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Homepage from './components/principal/Homepage.jsx';
import AllFlats from './pages/allFlats.jsx';
import LoginRegisterPage from './pages/LoginRegisterPage.jsx'; // Actualizado al nuevo nombre
//import Profile from './pages/Profile.jsx';
//import MyApartments from './pages/MyApartments.jsx';
//import Favorites from './pages/Favorites.jsx';
//import AdminPanel from './pages/AdminPanel.jsx';
import ProtectedRoute from './components/security/ProtectRoute.jsx';
import { Navigate } from 'react-router-dom';

// Componente para el error 404
const NotFound = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '80vh',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <h1>404: Página no encontrada</h1>
    <button onClick={() => window.location.href = '/'} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#4E9DE0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
      Volver al inicio
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={
            <PublicRoute>
              <LoginRegisterPage />
            </PublicRoute>
          } />

          {/* Rutas protegidas */}
          <Route path="/allflats" element={
            <ProtectedRoute>
              <AllFlats />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
             {/* <Profile />*/}
            </ProtectedRoute>
          } />
          
          <Route path="/my-apartments" element={
            <ProtectedRoute>
              {/* <MyApartments />*/}
            </ProtectedRoute>
          } />
          
          <Route path="/favorites" element={
            <ProtectedRoute>
              {/* <Favorites />*/}
            </ProtectedRoute>
          } />

          {/* Ruta de admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
{/*               <AdminPanel />*/}
            </ProtectedRoute>
          } />

          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente para rutas públicas (redirige si está autenticado)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};



export default App;
>>>>>>> origin/feature/homepage
