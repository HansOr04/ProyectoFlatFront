import React, { useState } from "react";
import { Container, Box, Button, TextField, Typography, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
              ? "Reset Password"
              : (isLogin ? "Welcome Back" : "Create Account")}
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
                />
              ) : isLogin ? (
                <Login 
                  setError={setError} 
                  navigate={navigate} 
                  setShowForgotPassword={setShowForgotPassword}
                />
              ) : (
                <Register 
                  setError={setError} 
                  navigate={navigate} 
                />
              )}
            </motion.div>
          </AnimatePresence>

          {!showForgotPassword && (
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
          )}
        </Box>
      </Box>
    </Container>
  );
};

const Login = ({ setError, navigate, setShowForgotPassword }) => {
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
        error={!!errors.email}
        helperText={errors.email}
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
        Sign in
      </Button>
      
      <Button
        onClick={() => setShowForgotPassword(true)}
        sx={{
          mt: 1,
          textTransform: "none",
          color: "text.secondary"
        }}
      >
        Forgot your password?
      </Button>
    </Box>
  );
};

const ForgotPassword = ({ setError, onClose }) => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post('http://localhost:8080/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSuccessMessage("Password reset link has been sent to your email");
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

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
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      
      <Button
        onClick={onClose}
        fullWidth
        sx={{
          mt: 1,
          textTransform: "none",
        }}
      >
        Back to Login
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
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required";
    } else if (age < 18 || age > 120) {
      newErrors.birthDate = "Age must be between 18 and 120 years";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters with at least one uppercase letter, one lowercase letter, one number and one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during registration");
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
          id="firstName"
          label="First Name"
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
          label="Last Name"
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
        label="Email Address"
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
        label="Password"
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
        label="Confirm Password"
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
        label="Birth Date"
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
        Create Account
      </Button>
    </Box>
  );
};

export default LoginRegisterPage;