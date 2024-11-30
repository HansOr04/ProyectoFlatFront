// Primero, agreguemos los imports necesarios
import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Importamos todos los íconos necesarios para las amenities
import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import HeatPumpIcon from '@mui/icons-material/HeatPump';
import WeekendIcon from '@mui/icons-material/Weekend';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ElevatorIcon from '@mui/icons-material/Elevator';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PetsIcon from '@mui/icons-material/Pets';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import CelebrationIcon from '@mui/icons-material/Celebration';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import BathtubIcon from '@mui/icons-material/Bathtub';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';

const initialFormData = {
  title: "",
  description: "",
  propertyType: "apartment",
  city: "",
  streetName: "",
  streetNumber: "",
  areaSize: "",
  bedrooms: "",
  bathrooms: "",
  maxGuests: "",
  yearBuilt: "",
  rentPrice: "",
  dateAvailable: "",
  images: [],
  amenities: {
    wifi: false,
    tv: false,
    kitchen: false,
    washer: false,
    airConditioning: false,
    heating: false,
    workspace: false,
    parking: {
      available: false,
      type: 'none',
      details: ""
    },
    pool: false,
    gym: false,
    elevator: false,
    petsAllowed: false,
    smokeAlarm: false,
    firstAidKit: false,
    fireExtinguisher: false,
    securityCameras: false
  },
  houseRules: {
    smokingAllowed: false,
    eventsAllowed: false,
    quietHours: {
      start: "22:00",
      end: "08:00"
    },
    additionalRules: []
  }
};

const AmenityBox = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const FormPaper = styled(Paper)`
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled(Typography)`
  margin-bottom: 24px;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
`;

const AmenityCheckbox = styled(FormControlLabel)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 4px;
  padding: 8px;
  flex: 1;
  min-width: 200px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(23, 165, 170, 0.1);
  }

  &.Mui-checked {
    background-color: rgba(23, 165, 170, 0.2);
    border-color: rgb(23, 165, 170);
  }
`;
const PageContainer = styled(Container)`
  padding: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    &:hover fieldset {
      border-color: rgb(23, 165, 170);
    }
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: rgb(23, 165, 170);
  }
  & .MuiInputLabel-root.Mui-focused {
    color: rgb(23, 165, 170);
  }
`;
const SubmitButton = styled(Button)`
  background-color: rgb(23, 165, 170);
  padding: 12px;
  margin-top: 16px;
  font-weight: 600;
  
  &:hover {
    background-color: rgb(18, 140, 145);
  }
  
  &:disabled {
    background-color: rgba(23, 165, 170, 0.5);
  }
`;
const CreateFlat = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      }
    };
  
    const handleAmenityChange = (amenity) => {
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [amenity]: !prev.amenities[amenity]
        }
      }));
    };
  
    const handleParkingChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          parking: {
            ...prev.amenities.parking,
            [field]: value
          }
        }
      }));
    };
  
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        setMessage("Máximo 5 imágenes permitidas");
        return;
      }
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
  
      try {
        const formDataToSend = new FormData();
        
        // Agregar datos básicos
        Object.keys(formData).forEach(key => {
          if (key !== 'images' && key !== 'amenities' && key !== 'houseRules') {
            formDataToSend.append(key, formData[key]);
          }
        });
  
        // Agregar amenities y houseRules como JSON
        formDataToSend.append('amenities', JSON.stringify(formData.amenities));
        formDataToSend.append('houseRules', JSON.stringify(formData.houseRules));
  
        // Agregar imágenes
        formData.images.forEach((file) => {
          formDataToSend.append('images', file);
        });
  
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:8080/flats',
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        setMessage("¡Propiedad creada exitosamente!");
        setFormData(initialFormData);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error al crear la propiedad");
      } finally {
        setLoading(false);
      }
    };
  
    const amenityIcons = {
      wifi: <WifiIcon />,
      tv: <TvIcon />,
      kitchen: <KitchenIcon />,
      washer: <LocalLaundryServiceIcon />,
      airConditioning: <AcUnitIcon />,
      heating: <HeatPumpIcon />,
      workspace: <WorkIcon />,
      pool: <PoolIcon />,
      gym: <FitnessCenterIcon />,
      elevator: <ElevatorIcon />,
      petsAllowed: <PetsIcon />,
    };
  
    const amenityLabels = {
      wifi: "WiFi",
      tv: "TV",
      kitchen: "Cocina",
      washer: "Lavadora",
      airConditioning: "Aire acondicionado",
      heating: "Calefacción",
      workspace: "Zona de trabajo",
      pool: "Piscina",
      gym: "Gimnasio",
      elevator: "Elevador",
      petsAllowed: "Mascotas permitidas",
    };
  
    return (
      <PageContainer maxWidth="lg">
        <FormPaper component="form" onSubmit={handleSubmit}>
          <FormTitle variant="h4">Crear Nueva Propiedad</FormTitle>
  
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                required
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
  
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Propiedad</InputLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  label="Tipo de Propiedad"
                >
                  <MenuItem value="apartment">Apartamento</MenuItem>
                  <MenuItem value="house">Casa</MenuItem>
                  <MenuItem value="studio">Estudio</MenuItem>
                  <MenuItem value="loft">Loft</MenuItem>
                  <MenuItem value="room">Habitación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
  
            {/* Detalles de la propiedad */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Detalles de la Propiedad</Typography>
            </Grid>
  
            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Comodidades</Typography>
              <AmenityBox>
                <Grid container spacing={2}>
                  {Object.keys(amenityLabels).map((amenity) => (
                    <Grid item xs={12} sm={6} md={4} key={amenity}>
                      <AmenityCheckbox
                        control={
                          <Checkbox
                            checked={formData.amenities[amenity]}
                            onChange={() => handleAmenityChange(amenity)}
                            icon={amenityIcons[amenity]}
                            checkedIcon={amenityIcons[amenity]}
                          />
                        }
                        label={amenityLabels[amenity]}
                        className={formData.amenities[amenity] ? 'Mui-checked' : ''}
                      />
                    </Grid>
                  ))}
                </Grid>
              </AmenityBox>
            </Grid>
  
            {/* Parking Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Estacionamiento</Typography>
              <AmenityBox>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.amenities.parking.available}
                      onChange={(e) => handleParkingChange('available', e.target.checked)}
                    />
                  }
                  label="Estacionamiento disponible"
                />
                {formData.amenities.parking.available && (
                  <FormControl fullWidth>
                    <InputLabel>Tipo de estacionamiento</InputLabel>
                    <Select
                      value={formData.amenities.parking.type}
                      onChange={(e) => handleParkingChange('type', e.target.value)}
                      label="Tipo de estacionamiento"
                    >
                      <MenuItem value="free">Gratuito</MenuItem>
                      <MenuItem value="paid">De pago</MenuItem>
                      <MenuItem value="street">En la calle</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </AmenityBox>
            </Grid>
  
            {/* Imágenes */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Imágenes</Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="images-input"
              />
              <label htmlFor="images-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Subir Imágenes (máximo 5)
                </Button>
              </label>
              {formData.images.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formData.images.length} imágenes seleccionadas
                </Typography>
              )}
            </Grid>
  
            {/* Submit Button */}
            <Grid item xs={12}>
              <SubmitButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Propiedad"}
              </SubmitButton>
            </Grid>
  
            {message && (
              <Grid item xs={12}>
                <Typography
                  color={message.includes("exitosamente") ? "success" : "error"}
                  align="center"
                >
                  {message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </FormPaper>
      </PageContainer>
    );
  };
  
  export default CreateFlat;