import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import styled from "styled-components";

const PageContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupa toda la altura de la ventana */
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Aquí puedes agregar la lógica para restablecer la contraseña
    console.log("Contraseña restablecida");
  };

  return (
    <PageContainer maxWidth="sm">
      <FormContainer>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#0E3F33" }}
        >
          Restablecer Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
          >
            Restablecer Contraseña
          </StyledButton>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default ResetPassword;
