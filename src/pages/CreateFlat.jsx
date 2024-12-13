import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ImageList,
  ImageListItem,
  IconButton,
} from '@mui/material';
import styled from 'styled-components';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Wifi as WifiIcon,
  Tv as TvIcon,
  Kitchen as KitchenIcon,
  LocalLaundryService as WasherIcon,
  AcUnit as AcIcon,
  HeatPump as HeatingIcon,
  Work as WorkspaceIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Elevator as ElevatorIcon,
  Pets as PetsIcon,
  HealthAndSafety as SecurityIcon,
  LocalHospital as FirstAidIcon,
  FireExtinguisher as FireExtinguisherIcon,
  VideoCameraBack as CameraIcon,
  LocalParking as ParkingIcon,
} from '@mui/icons-material';

// Styled Components
const FormSection = styled(Box)`
  margin: 24px 0;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const SectionTitle = styled(Typography)`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgb(23, 165, 170);
`;

const AmenityBox = styled(Box)`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const AmenityCard = styled(Box)`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: rgba(23, 165, 170, 0.1);
  }
  &.selected {
    background-color: rgba(23, 165, 170, 0.2);
    border-color: rgb(23, 165, 170);
  }
`;

// Configuraciones
const propertyTypes = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'studio', label: 'Estudio' },
  { value: 'loft', label: 'Loft' },
  { value: 'room', label: 'Habitación' }
];

const parkingTypes = [
  { value: 'free', label: 'Gratuito' },
  { value: 'paid', label: 'De pago' },
  { value: 'street', label: 'En la calle' }
];

const amenitiesConfig = [
  { key: 'wifi', label: 'WiFi', icon: WifiIcon },
  { key: 'tv', label: 'TV', icon: TvIcon },
  { key: 'kitchen', label: 'Cocina', icon: KitchenIcon },
  { key: 'washer', label: 'Lavadora', icon: WasherIcon },
  { key: 'airConditioning', label: 'Aire Acondicionado', icon: AcIcon },
  { key: 'heating', label: 'Calefacción', icon: HeatingIcon },
  { key: 'workspace', label: 'Zona de trabajo', icon: WorkspaceIcon },
  { key: 'pool', label: 'Piscina', icon: PoolIcon },
  { key: 'gym', label: 'Gimnasio', icon: GymIcon },
  { key: 'elevator', label: 'Elevador', icon: ElevatorIcon },
  { key: 'petsAllowed', label: 'Mascotas permitidas', icon: PetsIcon },
  { key: 'smokeAlarm', label: 'Alarma de humo', icon: SecurityIcon },
  { key: 'firstAidKit', label: 'Botiquín', icon: FirstAidIcon },
  { key: 'fireExtinguisher', label: 'Extintor', icon: FireExtinguisherIcon },
  { key: 'securityCameras', label: 'Cámaras de seguridad', icon: CameraIcon }
];const CreateFlat = () => {
  // Estados iniciales

  const initialFormData = {
    // Información básica
    title: '',
    description: '',
    propertyType: '',
    city: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',

    // Amenidades
    amenities: {
        wifi: false,
        tv: false,
        kitchen: false,
        washer: false,
        airConditioning: false,
        heating: false,
        workspace: false,
        pool: false,
        gym: false,
        elevator: false,
        petsAllowed: false,
        smokeAlarm: false,
        firstAidKit: false,
        fireExtinguisher: false,
        securityCameras: false,
        parking: {
            available: false,
            type: 'none',
            details: ''
        }
    },

    // Reglas de la casa
    houseRules: {
        smokingAllowed: false,
        eventsAllowed: false,
        quietHours: {
            start: '22:00',
            end: '08:00'
        },
        additionalRules: ['']
    },

    // Ubicación
    location: {
        coordinates: {
            lat: '',
            lng: ''
        },
        neighborhood: '',
        zipCode: '',
        publicTransport: [''],
        nearbyPlaces: ['']
    },

    // Disponibilidad
    availability: {
        minimumStay: '',
        maximumStay: '',
        instantBooking: false,
        advanceNotice: ''
    },

    images: []
};
const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  // Event Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        let newData = { ...prev };
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = type === 'checkbox' ? checked : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (parent, field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: prev[parent][field].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (parent, field) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...prev[parent][field], '']
      }
    }));
  };

  const removeArrayItem = (parent, field, index) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: prev[parent][field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage("Máximo 5 imágenes permitidas");
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: files
    }));

    // Crear las previsualizaciones
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    // Limpiar las URLs anteriores
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(imagePreviews[index].url);
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
        // Crear un objeto con todos los datos excepto las imágenes
        const flatData = {
            // Información básica
            title: formData.title,
            description: formData.description,
            propertyType: formData.propertyType,
            city: formData.city,
            streetName: formData.streetName,
            streetNumber: formData.streetNumber,
            areaSize: Number(formData.areaSize),
            yearBuilt: Number(formData.yearBuilt),
            rentPrice: Number(formData.rentPrice),
            dateAvailable: formData.dateAvailable,
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            maxGuests: Number(formData.maxGuests),

            // Amenidades (copiar el objeto completo)
            amenities: formData.amenities,

            // Reglas de la casa
            houseRules: formData.houseRules,

            // Ubicación
            location: formData.location,

            // Disponibilidad
            availability: {
                minimumStay: Number(formData.availability.minimumStay) || 1,
                maximumStay: Number(formData.availability.maximumStay) || 365,
                instantBooking: formData.availability.instantBooking,
                advanceNotice: Number(formData.availability.advanceNotice) || 1
            }
        };

        const formDataToSend = new FormData();

        // Añadir las imágenes
        formData.images.forEach(file => {
            formDataToSend.append('images', file);
        });

        // Añadir el resto de datos como un JSON string
        Object.keys(flatData).forEach(key => {
            formDataToSend.append(key, 
                typeof flatData[key] === 'object' 
                    ? JSON.stringify(flatData[key]) 
                    : flatData[key]
            );
        });

        const response = await fetch('http://localhost:8080/flats', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataToSend
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al crear la propiedad');
        }

        setMessage('¡Propiedad creada exitosamente!');
        setFormData(initialFormData);
        setImagePreviews([]);
    } catch (error) {
        console.error('Error completo:', error);
        setMessage(error.message);
    } finally {
        setLoading(false);
    }
};

  // Cleanup effect
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, []);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'rgb(23, 165, 170)', fontWeight: 600 }}>
          Crear Nueva Propiedad
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <FormSection>
            <SectionTitle variant="h6">Información Básica</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Título"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Modern Apartment in Downtown"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Descripción"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Beautiful modern apartment with great views"
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
                    {propertyTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Precio mensual"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  placeholder="1200"
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Características */}
          <FormSection>
            <SectionTitle variant="h6">Características</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Habitaciones"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="2"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Baños"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="1"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Huéspedes máximos"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  placeholder="4"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Tamaño (m²)"
                  name="areaSize"
                  value={formData.areaSize}
                  onChange={handleChange}
                  placeholder="85"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Año construcción"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  placeholder="2020"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Fecha disponible"
                  name="dateAvailable"
                  value={formData.dateAvailable}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </FormSection>
          {/* Amenidades */}
          <FormSection>
            <SectionTitle variant="h6">Amenidades</SectionTitle>
            <AmenityBox>
              <Grid container spacing={2}>
                {amenitiesConfig.map(amenity => {
                  const Icon = amenity.icon;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={amenity.key}>
                      <AmenityCard 
                        className={formData.amenities[amenity.key] ? 'selected' : ''}
                        onClick={() => handleChange({
                          target: {
                            name: `amenities.${amenity.key}`,
                            type: 'checkbox',
                            checked: !formData.amenities[amenity.key]
                          }
                        })}
                      >
                        <Icon sx={{ mr: 1, color: 'rgb(23, 165, 170)' }} />
                        <Typography>{amenity.label}</Typography>
                      </AmenityCard>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Parking Section */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Estacionamiento</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.amenities.parking.available}
                          onChange={handleChange}
                          name="amenities.parking.available"
                        />
                      }
                      label="Estacionamiento disponible"
                    />
                  </Grid>
                  {formData.amenities.parking.available && (
                    <>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Tipo de estacionamiento</InputLabel>
                          <Select
                            name="amenities.parking.type"
                            value={formData.amenities.parking.type}
                            onChange={handleChange}
                            label="Tipo de estacionamiento"
                          >
                            {parkingTypes.map(type => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Detalles del estacionamiento"
                          name="amenities.parking.details"
                          value={formData.amenities.parking.details}
                          onChange={handleChange}
                          placeholder="Free street parking available"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </AmenityBox>
          </FormSection>

          {/* House Rules */}
          <FormSection>
            <SectionTitle variant="h6">Reglas de la Casa</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.houseRules.smokingAllowed}
                      onChange={handleChange}
                      name="houseRules.smokingAllowed"
                    />
                  }
                  label="Permitido fumar"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.houseRules.eventsAllowed}
                      onChange={handleChange}
                      name="houseRules.eventsAllowed"
                    />
                  }
                  label="Eventos permitidos"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Inicio horas de silencio"
                  name="houseRules.quietHours.start"
                  value={formData.houseRules.quietHours.start}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Fin horas de silencio"
                  name="houseRules.quietHours.end"
                  value={formData.houseRules.quietHours.end}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Reglas adicionales */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Reglas adicionales</Typography>
                {formData.houseRules.additionalRules.map((rule, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Regla ${index + 1}`}
                      value={rule}
                      onChange={(e) => handleArrayChange('houseRules', 'additionalRules', index, e.target.value)}
                      placeholder="No parties"
                    />
                    <Button
                      color="error"
                      onClick={() => removeArrayItem('houseRules', 'additionalRules', index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addArrayItem('houseRules', 'additionalRules')}
                  sx={{ mb: 2 }}
                >
                  Agregar regla
                </Button>
              </Grid>
            </Grid>
          </FormSection>

          {/* Ubicación y Transporte */}
          <FormSection>
            <SectionTitle variant="h6">Ubicación y Transporte</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Ciudad"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Barcelona"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Barrio"
                  name="location.neighborhood"
                  value={formData.location.neighborhood}
                  onChange={handleChange}
                  placeholder="Eixample"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Calle"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleChange}
                  placeholder="Carrer de València"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Número"
                  name="streetNumber"
                  value={formData.streetNumber}
                  onChange={handleChange}
                  placeholder="123"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleChange}
                  placeholder="08009"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Latitud"
                  name="location.coordinates.lat"
                  value={formData.location.coordinates.lat}
                  onChange={handleChange}
                  placeholder="41.3851"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Longitud"
                  name="location.coordinates.lng"
                  value={formData.location.coordinates.lng}
                  onChange={handleChange}
                  placeholder="2.1734"
                />
              </Grid>

              {/* Transporte público */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Transporte público</Typography>
                {formData.location.publicTransport.map((transport, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Transporte ${index + 1}`}
                      value={transport}
                      onChange={(e) => handleArrayChange('location', 'publicTransport', index, e.target.value)}
                      placeholder="Metro L4 - 5 min walk"
                    />
                    <Button
                      color="error"
                      onClick={() => removeArrayItem('location', 'publicTransport', index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addArrayItem('location', 'publicTransport')}
                  sx={{ mb: 2 }}
                >
                  Agregar transporte
                </Button>
              </Grid>

              {/* Lugares cercanos */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Lugares cercanos</Typography>
                {formData.location.nearbyPlaces.map((place, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Lugar ${index + 1}`}
                      value={place}
                      onChange={(e) => handleArrayChange('location', 'nearbyPlaces', index, e.target.value)}
                      placeholder="Sagrada Familia - 15 min walk"
                    />
                    <Button
                      color="error"
                      onClick={() => removeArrayItem('location', 'nearbyPlaces', index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addArrayItem('location', 'nearbyPlaces')}
                >
                  Agregar lugar cercano
                </Button>
              </Grid>
            </Grid>
          </FormSection>

          {/* Disponibilidad */}
          <FormSection>
            <SectionTitle variant="h6">Disponibilidad</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Estancia mínima (días)"
                  name="availability.minimumStay"
                  value={formData.availability.minimumStay}
                  onChange={handleChange}
                  placeholder="30"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Estancia máxima (días)"
                  name="availability.maximumStay"
                  value={formData.availability.maximumStay}
                  onChange={handleChange}
                  placeholder="365"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.availability.instantBooking}
                      onChange={handleChange}
                      name="availability.instantBooking"
                    />
                  }
                  label="Reserva instantánea"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Aviso previo (días)"
                  name="availability.advanceNotice"
                  value={formData.availability.advanceNotice}
                  onChange={handleChange}
                  placeholder="2"
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Imágenes */}
          <FormSection>
            <SectionTitle variant="h6">Imágenes</SectionTitle>
            <Box sx={{ textAlign: 'center' }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="images-input"
              />
              <label htmlFor="images-input">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    backgroundColor: 'rgb(23, 165, 170)',
                    '&:hover': {
                      backgroundColor: 'rgb(18, 140, 145)',
                    }
                  }}
                >
                  Subir Imágenes (máximo 5)
                </Button>
              </label>
              
              {imagePreviews.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} gap={8}>
                    {imagePreviews.map((preview, index) => (
                      <ImageListItem 
                        key={index}
                        sx={{ 
                          position: 'relative',
                          '&:hover .deleteButton': {
                            opacity: 1
                          }
                        }}
                      >
                        <img
                          src={preview.url}
                          alt={preview.name}
                          loading="lazy"
                          style={{ 
                            height: '200px',
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          className="deleteButton"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            }
                          }}
                        >
                          <CancelIcon sx={{ color: 'rgb(23, 165, 170)' }} />
                        </IconButton>
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            padding: '4px',
                            textAlign: 'center',
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px',
                          }}
                        >
                          {preview.name}
                        </Typography>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
              
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                {imagePreviews.length > 0 
                  ? `${imagePreviews.length} ${imagePreviews.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}`
                  : 'No hay imágenes seleccionadas'
                }
              </Typography>
            </Box>
          </FormSection>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ 
              mt: 3,
              backgroundColor: 'rgb(23, 165, 170)',
              '&:hover': {
                backgroundColor: 'rgb(18, 140, 145)',
              },
              height: '50px',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                Creando propiedad...
              </Box>
            ) : (
              "Crear Propiedad"
            )}
          </Button>

          {message && (
            <Typography
              color={message.includes("exitosamente") ? "success.main" : "error.main"}
              align="center"
              sx={{ 
                mt: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: message.includes("exitosamente") 
                  ? 'rgba(76, 175, 80, 0.1)' 
                  : 'rgba(244, 67, 54, 0.1)'
              }}
            >
              {message}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default CreateFlat;