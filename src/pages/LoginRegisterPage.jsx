import React, { useState } from "react";
import { Container, Box, Button, TextField, Typography, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setError("");
    setIsLogin(!isLogin);
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
      <Box
        sx={{
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
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            flex: { xs: "1", md: "1.5" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            minHeight: { xs: "200px", md: "600px" },
          }}
        >
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

        {/* Form Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            maxWidth: { xs: "100%", md: "450px" },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 4,
              color: "primary.main",
            }}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%" }}
            >
              {isLogin ? (
                <Login setError={setError} navigate={navigate} />
              ) : (
                <Register setError={setError} navigate={navigate} />
              )}
            </motion.div>
          </AnimatePresence>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
            <Button
              onClick={toggleForm}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

const Login = ({ setError, navigate }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
        window.location.reload(); // Para actualizar el Navbar
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during login");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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

const Register = ({ setError, navigate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Verificar edad mínima (18 años)
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError("You must be at least 18 years old");
      return;
    }

    try {
      const registerData = {
        ...formData,
        birthDate: formData.birthDate,
      };
      delete registerData.confirmPassword;

      const response = await axios.post('http://localhost:8080/auth/register', registerData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
        window.location.reload(); // Para actualizar el Navbar
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during registration");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
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
        Create Account
      </Button>
    </Box>
  );
};

export default LoginRegisterPage;