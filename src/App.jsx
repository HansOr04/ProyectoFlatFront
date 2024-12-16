import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import Homepage from "./components/principal/Homepage.jsx";
import AllFlats from "./pages/allFlats.jsx";
import LoginRegisterPage from "./pages/LoginRegisterPage.jsx";
import MyApartments from "./pages/MyApartments.jsx";
import FavoritesView from "./pages/FavoritesView.jsx";
import DetailsFlatPage from "./pages/DetailsFlatPage.jsx";
import EditApartment from "./pages/UpdateFlat.jsx";
import CreateFlat from "./pages/CreateFlat.jsx";
import ProtectedRoute from "./components/security/ProtectRoute.jsx";
import ProfileUpdate from "./pages/ProfileUpdate.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const NotFound = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      flexDirection: "column",
      gap: "20px",
    }}
  >
    <h1>404: Página no encontrada</h1>
    <button
      onClick={() => (window.location.href = "/")}
      style={{
        padding: "10px 20px",
        backgroundColor: "rgb(23, 165, 170)",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: "#1FD1D7",
        },
      }}
    >
      Volver al inicio
    </button>
  </div>
);

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Homepage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginRegisterPage />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/allflats"
            element={
              <ProtectedRoute>
                <AllFlats />
              </ProtectedRoute>
            }
          />

          {/* Rutas de perfil */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileUpdate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <ProfileUpdate />
              </ProtectedRoute>
            }
          />

          {/* Rutas de flats */}
          <Route
            path="/flats/:id"
            element={
              <ProtectedRoute>
                <DetailsFlatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
                <ResetPassword />
            }
          />

          <Route
            path="/apartments/edit/:id"
            element={
              <ProtectedRoute>
                <EditApartment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-flat"
            element={
              <ProtectedRoute>
                <CreateFlat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-apartments"
            element={
              <ProtectedRoute>
                <MyApartments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesView />
              </ProtectedRoute>
            }
          />

          {/* Ruta de admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
