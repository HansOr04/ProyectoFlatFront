import React, { useState } from "react";
import { Container, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
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
          <img
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

          {isLogin ? <Login /> : <Register />}

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

const Login = () => {
  //Conexión con el backend para el login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      // console.log(response); Se valida que el token se reciba correctamente
      if (response.data.token) {
        localStorage.setItem("jwt", response.data.token); // Se guarda el token en el localStorage
        setMessage(response.data.message); // Se muestra el mensaje de éxito
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  //Formulario de login

  return (
    <Box onSubmit={handleSubmit} component="form" sx={{ width: "100%" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        onChange={(event) => setEmail(event.target.value)}
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        sx={{ mb: 2 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        onChange={(event) => setPassword(event.target.value)}
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
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
      {message && <p>{message}</p>}
    </Box>
  );
};

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();

    if (!emailRegex.test(email)) {
      newErrors.email = "Correo electrónico no válido";
    }
    if (firstName.length < 2) {
      newErrors.firstName = "Nombre debe tener al menos 2 caracteres";
    }
    if (lastName.length < 2) {
      newErrors.lastName = "Apellido debe tener al menos 2 caracteres";
    }
    if (age < 18 || age > 120) {
      newErrors.birthDate = "La edad debe ser entre 18 y 120 años";
    }
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Contraseña debe tener al menos 6 caracteres, con al menos una letra, un número y un carácter especial";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Conexión con el backend para el registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        birthDate,
      });
      console.log(response);
      if (response.data.token) {
        localStorage.setItem("jwt", response.data.token);
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <Box onSubmit={handleSubmit} component="form" sx={{ width: "100%" }}>
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
          onChange={(event) => setFirstName(event.target.value)}
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          autoFocus
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          required
          fullWidth
          onChange={(event) => setLastName(event.target.value)}
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Box>
      <TextField
        required
        fullWidth
        onChange={(event) => setEmail(event.target.value)}
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        sx={{ mb: 2 }}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        required
        fullWidth
        onChange={(event) => setPassword(event.target.value)}
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        sx={{ mb: 2 }}
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        required
        fullWidth
        onChange={(event) => setConfirmPassword(event.target.value)}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        sx={{ mb: 2 }}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
      <TextField
        required
        fullWidth
        onChange={(event) => setBirthDate(event.target.value)}
        name="birthDate"
        label="Birth Date"
        type="date"
        id="birthDate"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mb: 3 }}
        error={!!errors.birthDate}
        helperText={errors.birthDate}
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
      {message && <p>{message}</p>}
    </Box>
  );
};

export default LoginRegisterPage;
