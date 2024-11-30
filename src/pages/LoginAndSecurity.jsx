import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import styled from "styled-components";
import SecurityIcon from "@mui/icons-material/Security";

const StyledContainer = styled(Container)`
  padding: 2rem;
  background-color: #f8f9fa;
`;

const Section = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoContainer = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .MuiSvgIcon-root {
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  .MuiTypography-h6 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 0.75rem;
  }

  .MuiTypography-body2 {
    color: #606060;
    text-align: center;
    line-height: 1.6;
  }
`;

const LoginAndSecurity = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [editPassword, setEditPassword] = useState(false);
  const [socialConnected, setSocialConnected] = useState({
    facebook: false,
    google: false,
  });
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handlePasswordEdit = () => {
    setEditPassword(true);
  };

  const handlePasswordSave = () => {
    setEditPassword(false);
    // Aquí puedes agregar la lógica para guardar la nueva contraseña
  };

  const handleSocialConnect = (platform) => {
    setSocialConnected({
      ...socialConnected,
      [platform]: !socialConnected[platform],
    });
  };

  const handleDeactivateAccount = () => {
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = () => {
    setDeactivateDialogOpen(false);
    // Aquí puedes agregar la lógica para desactivar la cuenta
  };

  return (
    <StyledContainer maxWidth="md">
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Inicio de sesión" />
        <Tab label="Acceso compartido" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {tabIndex === 0 && (
            <Box mt={3}>
              <Section>
                <Typography variant="h6" gutterBottom>
                  Inicio de sesión
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Última actualización: 01/01/2023
                </Typography>
                {editPassword ? (
                  <Box>
                    <TextField
                      label="Contraseña actual"
                      type="password"
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Nueva contraseña"
                      type="password"
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Confirmar nueva contraseña"
                      type="password"
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePasswordSave}
                    >
                      Actualiza la contraseña
                    </Button>
                  </Box>
                ) : (
                  <Button variant="contained" onClick={handlePasswordEdit}>
                    Modificar
                  </Button>
                )}
              </Section>

              <Section>
                <Typography variant="h6" gutterBottom>
                  Redes sociales
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Facebook</Typography>
                  <Button
                    variant="contained"
                    color={socialConnected.facebook ? "secondary" : "primary"}
                    onClick={() => handleSocialConnect("facebook")}
                  >
                    {socialConnected.facebook ? "Desconectar" : "Conectar"}
                  </Button>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Google</Typography>
                  <Button
                    variant="contained"
                    color={socialConnected.google ? "secondary" : "primary"}
                    onClick={() => handleSocialConnect("google")}
                  >
                    {socialConnected.google ? "Desconectar" : "Conectar"}
                  </Button>
                </Box>
              </Section>

              <Section>
                <Typography variant="h6" gutterBottom>
                  Cuenta
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeactivateAccount}
                >
                  Desactiva tu cuenta
                </Button>
              </Section>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box mt={3}>
              <Typography variant="h6">Acceso compartido</Typography>
              {/* Aquí puedes agregar el contenido de la pestaña de acceso compartido */}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <InfoContainer elevation={1}>
            <SecurityIcon color="primary" fontSize="large" />
            <Typography variant="h6" gutterBottom>
              Cómo garantizar la seguridad de tu cuenta
            </Typography>
            <Typography variant="body2">
              Revisamos periódicamente las cuentas para asegurarnos de que sean
              lo más seguras posible. También nos pondremos en contacto contigo
              si podemos hacer algo más para aumentar la seguridad de tu cuenta.
            </Typography>
            <Typography variant="body2">
              Descubre otros consejos de seguridad para huéspedes y anfitriones.
            </Typography>
          </InfoContainer>
        </Grid>
      </Grid>

      <Dialog
        open={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
      >
        <DialogTitle>Desactiva tu cuenta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea desactivar su cuenta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeactivateDialogOpen(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button onClick={handleDeactivateConfirm} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default LoginAndSecurity;
