import React, { useState } from "react";
import { Container, Box, Button, TextField, Typography, Alert, Snackbar } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setError("");
    setIsLogin(!isLogin);
  };

  const handleCloseSuccess = () => {
    setSuccessMessage("");
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FFF",
      }}
    >
      <Box sx={{
        width: "100%",
        maxWidth: "1200px",
        m: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        bgcolor: "white",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}>
        <Box sx={{
          flex: { xs: "1", md: "1.5" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          minHeight: { xs: "200px", md: "600px" },
        }}>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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

        <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          maxWidth: { xs: "100%", md: "450px" },
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{
            fontWeight: "bold",
            mb: 4,
            color: "primary.main",
          }}>
            {showForgotPassword 
              ? "Restablecer Contraseña"
              : (isLogin ? "Bienvenido de nuevo" : "Crear cuenta")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={showForgotPassword ? "forgot" : (isLogin ? "login" : "register")}
              initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%" }}
            >
              {showForgotPassword ? (
                <ForgotPassword 
                  setError={setError} 
                  onClose={() => setShowForgotPassword(false)}
                  setSuccessMessage={setSuccessMessage}
                />
              ) : isLogin ? (
                <Login 
                  setError={setError} 
                  navigate={navigate} 
                  setShowForgotPassword={setShowForgotPassword}
                  setSuccessMessage={setSuccessMessage}
                />
              ) : (
                <Register 
                  setError={setError} 
                  navigate={navigate}
                  setSuccessMessage={setSuccessMessage}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {!showForgotPassword && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
              </Typography>
              <Button onClick={toggleForm} sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}>
                {isLogin ? "Registrarse" : "Iniciar sesión"}
              </Button>
            </Box>
          )}

          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Container>
  );
};
const Login = ({ setError, navigate, setShowForgotPassword, setSuccessMessage }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setSuccessMessage("Inicio de sesión exitoso");
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error durante el inicio de sesión");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo electrónico"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 3 }}
      />
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
        Iniciar sesión
      </Button>
      
      <Button
        onClick={() => setShowForgotPassword(true)}
        sx={{
          mt: 1,
          textTransform: "none",
          color: "text.secondary"
        }}
      >
        ¿Olvidaste tu contraseña?
      </Button>
    </Box>
  );
};

const ForgotPassword = ({ setError, onClose, setSuccessMessage }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:8080/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSuccessMessage("El enlace de restablecimiento ha sido enviado a tu correo");
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error al enviar el enlace de restablecimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo electrónico"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          textTransform: "none",
          fontWeight: "bold",
          bgcolor: "#4E9DE0",
        }}
      >
        {loading ? "Enviando..." : "Enviar enlace"}
      </Button>
      
      <Button
        onClick={onClose}
        fullWidth
        sx={{
          mt: 1,
          textTransform: "none",
        }}
      >
        Volver al inicio de sesión
      </Button>
    </Box>
  );
};
const Register = ({ setError, navigate, setSuccessMessage }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    profileImage: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es requerida";
    } else if (age < 18 || age > 120) {
      newErrors.birthDate = "La edad debe estar entre 18 y 120 años";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Por favor confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Por favor sube un archivo de imagen");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("El tamaño de la imagen debe ser menor a 5MB");
        return;
      }

      setFormData({
        ...formData,
        profileImage: file
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('birthDate', formData.birthDate);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await axios.post('http://localhost:8080/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setSuccessMessage("Registro exitoso");
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error durante el registro");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
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
        <Button
          component="label"
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {imagePreview ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        mb: 2,
      }}>
        <TextField
          required
          fullWidth
          id="firstName"
          label="Nombre"
          name="firstName"
          autoComplete="given-name"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          autoFocus
        />
        <TextField
          required
          fullWidth
          id="lastName"
          label="Apellido"
          name="lastName"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Box>

      <TextField
        required
        fullWidth
        id="email"
        label="Correo electrónico"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
      />

      <TextField
        required
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 2 }}
      />

      <TextField
        required
        fullWidth
        name="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        sx={{ mb: 2 }}
      />

      <TextField
        required
        fullWidth
        name="birthDate"
        label="Fecha de nacimiento"
        type="date"
        id="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.birthDate}
        helperText={errors.birthDate}
        sx={{ mb: 3 }}
      />

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
        Crear cuenta
      </Button>
    </Box>
  );
};

export default LoginRegisterPage;