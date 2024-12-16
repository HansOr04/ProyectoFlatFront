import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import styled from "styled-components";
import axios from "axios";

const PageContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem !important;
  & .MuiInputBase-root {
    border-radius: 8px;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 1rem !important;
  padding: 0.75rem !important;
  border-radius: 8px !important;
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al restablecer la contraseña";
      setError(errorMessage);
      
      if (err.response?.status === 400) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="sm">
      <FormContainer>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#0E3F33", marginBottom: "2rem" }}
        >
          Restablecer Contraseña
        </Typography>
        
        {success ? (
          <Alert severity="success" sx={{ width: '100%', marginBottom: '1rem' }}>
            Contraseña restablecida exitosamente. Serás redirigido al login...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <StyledTextField
              label="Nueva Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Mínimo 8 caracteres, debe incluir números y mayúsculas"
            />
            <StyledTextField
              label="Confirmar Contraseña"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && (
              <Alert severity="error" sx={{ marginBottom: '1rem' }}>
                {error}
              </Alert>
            )}
            <StyledButton
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Restablecer Contraseña"}
            </StyledButton>
          </form>
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default ResetPassword;