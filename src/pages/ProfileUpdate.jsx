import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import ShareIcon from "@mui/icons-material/Share";

// Styled Components
const StyledContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  background-color: #f8f9fa;
`;

const StyledPaper = styled(Paper)`
  padding: 3rem;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

const FieldContainer = styled(Box)`
  width: 100%;
  margin-bottom: 2rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const FieldLabel = styled(Typography)`
  font-weight: 600;
  color: #2c3e50;
  margin-right: 1.5rem;
  min-width: 120px;
`;

const FieldActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const StyledAvatar = styled(Avatar)`
  width: 80px !important;
  height: 80px !important;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #1976d2;
    }
  }
`;

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "user@example.com", // Email quemado
    birthDate: "",
    profileImage: "", // Campo para la imagen de perfil
  });

  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
    profileImage: false, // Modo de edición para la imagen de perfil
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (field) => {
    setEditMode({
      ...editMode,
      [field]: true,
    });
  };

  const handleCancel = (field) => {
    setEditMode({
      ...editMode,
      [field]: false,
    });
  };

  const handleSave = (field) => {
    setEditMode({
      ...editMode,
      [field]: false,
    });
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log(`Saved ${field}:`, formData[field]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        profileImage: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "3rem",
                fontSize: "2rem",
                letterSpacing: "-0.5px",
              }}
            >
              Información personal
            </Typography>

            <FieldContainer>
              <FieldLabel>Profile Image</FieldLabel>
              {editMode.profileImage ? (
                <>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="profile-image-upload"
                  />
                  <label htmlFor="profile-image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        padding: "8px 16px",
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      Upload
                    </Button>
                  </label>
                </>
              ) : (
                <StyledAvatar alt="Profile Image" src={formData.profileImage} />
              )}
              <FieldActions>
                {editMode.profileImage ? (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => handleSave("profileImage")}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleCancel("profileImage")}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit("profileImage")}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </FieldActions>
            </FieldContainer>

            {Object.keys(formData).map(
              (field) =>
                field !== "profileImage" &&
                field !== "email" && (
                  <FieldContainer key={field}>
                    <FieldLabel>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </FieldLabel>
                    {editMode[field] ? (
                      <StyledTextField
                        variant="outlined"
                        fullWidth
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        type={field === "birthDate" ? "date" : "text"}
                        InputLabelProps={
                          field === "birthDate" ? { shrink: true } : {}
                        }
                      />
                    ) : (
                      <Typography>{formData[field]}</Typography>
                    )}
                    <FieldActions>
                      {editMode[field] ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleSave(field)}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleCancel(field)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(field)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </FieldActions>
                  </FieldContainer>
                )
            )}

            <FieldContainer>
              <FieldLabel>Email</FieldLabel>
              <Typography>{formData.email}</Typography>
            </FieldContainer>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoContainer elevation={1}>
            <InfoIcon color="primary" fontSize="large" />
            <Typography variant="h6" gutterBottom>
              ¿Por qué no aparece mi información aquí?
            </Typography>
            <Typography variant="body2">
              Ocultamos algunos datos de la cuenta para proteger tu identidad.
            </Typography>
          </InfoContainer>
          <InfoContainer elevation={1}>
            <EditAttributesIcon color="primary" fontSize="large" />
            <Typography variant="h6" gutterBottom>
              ¿Qué datos se pueden editar?
            </Typography>
            <Typography variant="body2">
              Los datos personales y de contacto pueden editarse. Si usamos esta
              información para verificar tu identidad, tendrás que volver a
              verificarla la próxima vez que hagas una reservación o quieras
              volver a anfitrionar.
            </Typography>
          </InfoContainer>
          <InfoContainer elevation={1}>
            <ShareIcon color="primary" fontSize="large" />
            <Typography variant="h6" gutterBottom>
              ¿Qué información se comparte con los demás?
            </Typography>
            <Typography variant="body2">
              Airbnb solo proporciona los datos de contacto de los anfitriones y
              los huéspedes una vez que la reservación se haya confirmado.
            </Typography>
          </InfoContainer>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default ProfileUpdate;
