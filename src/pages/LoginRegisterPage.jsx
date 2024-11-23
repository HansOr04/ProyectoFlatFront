import React, { useState } from "react";
import { Container, Box, Button, TextField, Typography } from "@mui/material";

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
  return (
    <Box component="form" sx={{ width: "100%" }}>
      <TextField
        margin="normal"
        required
        fullWidth
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
    </Box>
  );
};

const Register = () => {
  return (
    <Box component="form" sx={{ width: "100%" }}>
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
          autoFocus
        />
        <TextField
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
        />
      </Box>
      <TextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
        sx={{ mb: 2 }}
      />
      <TextField
        required
        fullWidth
        name="birthDate"
        label="Birth Date"
        type="date"
        id="birthDate"
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
