// Importaciones necesarias de React y bibliotecas externas
import React, { useState } from "react"; // Importa React y el hook de estado
import { Container, Box, Button, TextField, Typography, Alert } from "@mui/material"; // Componentes de Material UI
import { motion, AnimatePresence } from "framer-motion"; // Componentes para animaciones
import { useNavigate } from "react-router-dom"; // Hook para navegación programática
import axios from "axios"; // Cliente HTTP para peticiones al servidor

// Componente principal que maneja la página de login/registro
const LoginRegisterPage = () => {
  // Estado para controlar qué formulario mostrar (login o registro)
  const [isLogin, setIsLogin] = useState(true);
  // Estado para manejar mensajes de error
  const [error, setError] = useState("");
  // Hook de navegación
  const navigate = useNavigate();

  // Función para alternar entre formularios de login y registro
  const toggleForm = () => {
    setError(""); // Limpia cualquier error previo
    setIsLogin(!isLogin); // Cambia el estado del formulario
  };

  return (
    // Contenedor principal que ocupa toda la altura de la ventana
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh", // Altura mínima de toda la ventana
        display: "flex",
        alignItems: "center", // Centra verticalmente
        justifyContent: "center", // Centra horizontalmente
        bgcolor: "#FFF",
      }}
    >
      {/* Caja contenedora principal del formulario e imagen */}
      <Box sx={{
        width: "100%",
        maxWidth: "1200px", // Ancho máximo del contenedor
        m: 2, // Margen
        display: "flex",
        // Responsivo: columna en móvil, fila en desktop
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        bgcolor: "white",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}>
        {/* Sección izquierda - Imagen decorativa */}
        <Box sx={{
          flex: { xs: "1", md: "1.5" }, // Proporción de espacio
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          // Altura mínima responsiva
          minHeight: { xs: "200px", md: "600px" },
        }}>
          {/* Imagen con animación de entrada */}
          <motion.img
            // Configuración de la animación inicial
            initial={{ scale: 0.8, opacity: 0 }}
            // Estado final de la animación
            animate={{ scale: 1, opacity: 1 }}
            // Duración de la animación
            transition={{ duration: 0.5 }}
            src="https://i.pinimg.com/736x/cd/5c/6f/cd5c6f38b0d24fa2f279ff53965980e4.jpg"
            alt="Login illustration"
            style={{
              width: "90%",
              height: "60%",
              objectFit: "cover",
              borderRadius: 20,
            }}
          />
        </Box>

        {/* Sección derecha - Formulario */}
        <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4, // Padding
          maxWidth: { xs: "100%", md: "450px" }, // Ancho máximo responsivo
        }}>
          {/* Título dinámico según el formulario activo */}
          <Typography variant="h4" component="h1" gutterBottom sx={{
            fontWeight: "bold",
            mb: 4,
            color: "primary.main",
          }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Typography>

          {/* Muestra alerta de error si existe */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Contenedor de animaciones para transición entre formularios */}
          <AnimatePresence mode="wait">
            <motion.div
              // Key única para la animación
              key={isLogin ? "login" : "register"}
              // Configuración de animaciones
              initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%" }}
            >
              {/* Renderiza condicionalmente el formulario correspondiente */}
              {isLogin ? (
                <Login setError={setError} navigate={navigate} />
              ) : (
                <Register setError={setError} navigate={navigate} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sección para cambiar entre formularios */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
            <Button onClick={toggleForm} sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}>
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

// Componente de formulario de Login
const Login = ({ setError, navigate }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Actualiza el campo específico
    });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      // Realiza la petición de login al servidor
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      
      if (response.data.success) {
        // Extrae token y datos del usuario
        const { token, user } = response.data.data;
        // Guarda datos en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Navega a la página principal
        navigate('/');
        window.location.reload(); // Recarga para actualizar el estado global
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during login");
    }
  };

  return (
    // Formulario de login
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {/* Campo de email */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      {/* Campo de contraseña */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />
      {/* Botón de submit */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 2,
          py: 1.5,
          textTransform: "none",
          fontWeight: "bold",
          bgcolor: "#4E9DE0",
        }}
      >
        Sign in
      </Button>
    </Box>
  );
};

// Componente de formulario de Registro
const Register = ({ setError, navigate }) => {
  // Estado para los datos del formulario incluyendo imagen de perfil
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    profileImage: null, // Para almacenar el archivo de imagen
  });
  
  // Estado separado para la URL de previsualización de la imagen
  const [imagePreview, setImagePreview] = useState(null);

  // Manejador de cambios en campos de texto
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejador específico para el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación del tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      // Validación del tamaño del archivo
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Actualiza el estado con el archivo
      setFormData({
        ...formData,
        profileImage: file
      });

      // Crea URL de previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validación de edad
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError("You must be at least 18 years old");
      return;
    }

    try {
      // Prepara los datos para enviar incluyendo la imagen
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('birthDate', formData.birthDate);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      // Realiza la petición de registro
      const response = await axios.post('http://localhost:8080/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Necesario para enviar archivos
        },
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during registration");
    }
  };

  return (
    // Formulario de registro
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {/* Sección de previsualización y carga de imagen */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        {/* Muestra la previsualización si existe */}
        {imagePreview && (
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 1rem auto',
              border: '2px solid #4E9DE0',
            }}
          >
            <img
              src={imagePreview}
              alt="Profile preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        {/* Botón para subir imagen */}
        <Button
          component="label"
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {imagePreview ? 'Change Profile Picture' : 'Upload Profile Picture'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      {/* Grid para nombre y apellido */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        mb: 2,
      }}>
        {/* Campo de nombre */}
        <TextField
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          value={formData.firstName}
          onChange={handleChange}
          autoFocus
        />
        {/* Campo de apellido */}
        <TextField
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={handleChange}
        />
      </Box>

      {/* Campos adicionales del formulario */}
      <TextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        required
        fullWidth
        name="birthDate"
        label="Birth Date"
        type="date"
        id="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mb: 3 }}
      />
      {/* Botón de envío */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 2, // Margen superior
          py: 1.5, // Padding vertical
          textTransform: "none", // Evita que el texto se convierta en mayúsculas
          fontWeight: "bold", // Texto en negrita
          bgcolor: "#4E9DE0", // Color de fondo personalizado
        }}
      >
        Create Account
      </Button>
    </Box>
  );
};

// Exporta el componente principal para su uso en otras partes de la aplicación
export default LoginRegisterPage;