import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import styled from "styled-components";

// Styled Components
const StyledContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 16px;

  @media (min-width: 960px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 3rem;
  }
`;

const ImageSection = styled(Box)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

  @media (min-width: 960px) {
    margin-bottom: 0;
    margin-right: 2rem;
  }
`;

const FormSection = styled(Box)`
  flex: 1;
  width: 100%;
  max-width: 500px;
`;

const ProfileImageContainer = styled(Box)`
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px !important;
  height: 120px !important;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const CameraButton = styled(IconButton)`
  position: absolute !important;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  background-color: #fff !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #f5f5f5 !important;
  }
`;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem !important;
  padding: 0.75rem !important;
`;

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <StyledContainer maxWidth={false}>
      <StyledPaper elevation={3}>
        <ImageSection>
          <img
            src="https://images.pexels.com/photos/1671051/pexels-photo-1671051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Profile illustration"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              borderRadius: "16px",
            }}
          />
        </ImageSection>

        <FormSection>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: "2rem" }}
          >
            Actualizar Perfil
          </Typography>

          <StyledForm onSubmit={handleSubmit}>
            <ProfileImageContainer>
              <StyledAvatar alt="Profile Image" src={formData.profileImage} />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profileImage"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profileImage">
                <CameraButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </CameraButton>
              </label>
            </ProfileImageContainer>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  name="firstName"
                  autoComplete="fname"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="lname"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="birthDate"
                  label="Fecha de Nacimiento"
                  type="date"
                  id="birthDate"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
            >
              Actualizar Perfil
            </StyledButton>
          </StyledForm>
        </FormSection>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ProfileUpdate;
