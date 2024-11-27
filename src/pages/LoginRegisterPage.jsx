import React, { useState } from "react";
<<<<<<< HEAD
import { Container, Box, Button, TextField, Typography } from "@mui/material";
=======
import { Container, Box, Button, TextField, Typography, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
>>>>>>> origin/feature/homepage
import axios from "axios";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
<<<<<<< HEAD

  const toggleForm = () => {
=======
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setError("");
>>>>>>> origin/feature/homepage
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
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/feature/homepage
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

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/feature/homepage

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
<<<<<<< HEAD
            <Button
              onClick={toggleForm}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
=======
            <Button onClick={toggleForm} sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}>
>>>>>>> origin/feature/homepage
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

<<<<<<< HEAD
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
=======
const Login = ({ setError, navigate }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during login");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
>>>>>>> origin/feature/homepage
      <TextField
        margin="normal"
        required
        fullWidth
<<<<<<< HEAD
        onChange={(event) => setEmail(event.target.value)}
=======
>>>>>>> origin/feature/homepage
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
<<<<<<< HEAD
=======
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
>>>>>>> origin/feature/homepage
        sx={{ mb: 2 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
<<<<<<< HEAD
        onChange={(event) => setPassword(event.target.value)}
=======
>>>>>>> origin/feature/homepage
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
<<<<<<< HEAD
=======
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
>>>>>>> origin/feature/homepage
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
<<<<<<< HEAD
      {message && <p>{message}</p>}
=======
>>>>>>> origin/feature/homepage
    </Box>
  );
};

<<<<<<< HEAD
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("");
=======
const Register = ({ setError, navigate }) => {
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
>>>>>>> origin/feature/homepage
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
<<<<<<< HEAD
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
=======
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (age < 18 || age > 120) {
      newErrors.birthDate = "Age must be between 18 and 120 years";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters with at least one letter, one number and one special character";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
>>>>>>> origin/feature/homepage
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

<<<<<<< HEAD
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
=======
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
        setError("Please upload an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
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
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
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
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during registration");
>>>>>>> origin/feature/homepage
    }
  };

  return (
<<<<<<< HEAD
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
=======
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
          {imagePreview ? 'Change Profile Picture' : 'Upload Profile Picture'}
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
>>>>>>> origin/feature/homepage
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="given-name"
<<<<<<< HEAD
          autoFocus
          error={!!errors.firstName}
          helperText={errors.firstName}
=======
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          autoFocus
>>>>>>> origin/feature/homepage
        />
        <TextField
          required
          fullWidth
<<<<<<< HEAD
          onChange={(event) => setLastName(event.target.value)}
=======
>>>>>>> origin/feature/homepage
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
<<<<<<< HEAD
=======
          value={formData.lastName}
          onChange={handleChange}
>>>>>>> origin/feature/homepage
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Box>
<<<<<<< HEAD
      <TextField
        required
        fullWidth
        onChange={(event) => setEmail(event.target.value)}
=======

      <TextField
        required
        fullWidth
>>>>>>> origin/feature/homepage
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
<<<<<<< HEAD
        sx={{ mb: 2 }}
        error={!!errors.email}
        helperText={errors.email}
=======
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
>>>>>>> origin/feature/homepage
      />
      <TextField
        required
        fullWidth
<<<<<<< HEAD
        onChange={(event) => setPassword(event.target.value)}
=======
>>>>>>> origin/feature/homepage
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
<<<<<<< HEAD
        sx={{ mb: 2 }}
        error={!!errors.password}
        helperText={errors.password}
=======
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 2 }}
>>>>>>> origin/feature/homepage
      />
      <TextField
        required
        fullWidth
<<<<<<< HEAD
        onChange={(event) => setConfirmPassword(event.target.value)}
=======
>>>>>>> origin/feature/homepage
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
<<<<<<< HEAD
        sx={{ mb: 2 }}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
=======
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        sx={{ mb: 2 }}
>>>>>>> origin/feature/homepage
      />
      <TextField
        required
        fullWidth
<<<<<<< HEAD
        onChange={(event) => setBirthDate(event.target.value)}
=======
>>>>>>> origin/feature/homepage
        name="birthDate"
        label="Birth Date"
        type="date"
        id="birthDate"
<<<<<<< HEAD
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mb: 3 }}
        error={!!errors.birthDate}
        helperText={errors.birthDate}
=======
        value={formData.birthDate}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.birthDate}
        helperText={errors.birthDate}
        sx={{ mb: 3 }}
>>>>>>> origin/feature/homepage
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
<<<<<<< HEAD
      {message && <p>{message}</p>}
=======
>>>>>>> origin/feature/homepage
    </Box>
  );
};

<<<<<<< HEAD
export default LoginRegisterPage;
=======
export default LoginRegisterPage;
>>>>>>> origin/feature/homepage
