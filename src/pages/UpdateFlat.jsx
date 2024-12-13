import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import styled from 'styled-components';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
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
  { value: 'street', label: 'En la calle' },
  { value: 'none', label: 'Ninguno' }
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
];

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
const UpdateFlat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    const fetchFlatData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/flats/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar la información del flat');
        }

        const responseData = await response.json();
        if (responseData.success) {
          const flatData = responseData.data;

          // Formatear la fecha para el input type="date"
          const formattedDate = flatData.dateAvailable 
            ? new Date(flatData.dateAvailable).toISOString().split('T')[0] 
            : '';

          // Asegurarse de que todas las propiedades booleanas de amenities estén definidas
          const amenities = {
            ...initialFormData.amenities,
            ...flatData.amenities,
            parking: {
              ...initialFormData.amenities.parking,
              ...flatData.amenities?.parking
            }
          };

          // Asegurarse de que todas las reglas de la casa estén definidas
          const houseRules = {
            ...initialFormData.houseRules,
            ...flatData.houseRules,
            quietHours: {
              ...initialFormData.houseRules.quietHours,
              ...flatData.houseRules?.quietHours
            },
            additionalRules: flatData.houseRules?.additionalRules || ['']
          };

          // Asegurarse de que toda la información de ubicación esté definida
          const location = {
            ...initialFormData.location,
            ...flatData.location,
            coordinates: {
              ...initialFormData.location.coordinates,
              ...flatData.location?.coordinates
            },
            publicTransport: flatData.location?.publicTransport || [''],
            nearbyPlaces: flatData.location?.nearbyPlaces || ['']
          };

          setFormData({
            title: flatData.title || '',
            description: flatData.description || '',
            propertyType: flatData.propertyType || '',
            city: flatData.city || '',
            streetName: flatData.streetName || '',
            streetNumber: flatData.streetNumber || '',
            areaSize: flatData.areaSize?.toString() || '',
            yearBuilt: flatData.yearBuilt?.toString() || '',
            rentPrice: flatData.rentPrice?.toString() || '',
            dateAvailable: formattedDate,
            bedrooms: flatData.bedrooms?.toString() || '',
            bathrooms: flatData.bathrooms?.toString() || '',
            maxGuests: flatData.maxGuests?.toString() || '',
            amenities,
            houseRules,
            location,
            availability: {
              ...initialFormData.availability,
              ...flatData.availability
            }
          });

          // Establecer las imágenes existentes
          if (flatData.images && flatData.images.length > 0) {
            setExistingImages(flatData.images);
          }
        }
      } catch (error) {
        setMessage('Error al cargar la propiedad: ' + error.message);
        console.error('Error fetching flat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlatData();
  }, [id]);

  // Cleanup de las previsualizaciones de imágenes
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: 'rgb(23, 165, 170)' }} />
      </Box>
    );
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
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
    const totalImages = existingImages.length + files.length - imagesToDelete.length;
    
    if (totalImages > 5) {
      setMessage("Máximo 5 imágenes permitidas");
      return;
    }

    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img._id !== imageId));
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].url);
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCancel = () => {
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    navigate(-1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Preparar los datos básicos
      const basicData = {
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
        maxGuests: Number(formData.maxGuests)
      };

      // Añadir cada campo al FormData
      Object.entries(basicData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // Añadir amenities
      formDataToSend.append('amenities', JSON.stringify({
        wifi: Boolean(formData.amenities.wifi),
        tv: Boolean(formData.amenities.tv),
        kitchen: Boolean(formData.amenities.kitchen),
        washer: Boolean(formData.amenities.washer),
        airConditioning: Boolean(formData.amenities.airConditioning),
        heating: Boolean(formData.amenities.heating),
        workspace: Boolean(formData.amenities.workspace),
        pool: Boolean(formData.amenities.pool),
        gym: Boolean(formData.amenities.gym),
        elevator: Boolean(formData.amenities.elevator),
        petsAllowed: Boolean(formData.amenities.petsAllowed),
        smokeAlarm: Boolean(formData.amenities.smokeAlarm),
        firstAidKit: Boolean(formData.amenities.firstAidKit),
        fireExtinguisher: Boolean(formData.amenities.fireExtinguisher),
        securityCameras: Boolean(formData.amenities.securityCameras),
        parking: {
          available: Boolean(formData.amenities.parking.available),
          type: formData.amenities.parking.type,
          details: formData.amenities.parking.details
        }
      }));

      // Añadir house rules
      formDataToSend.append('houseRules', JSON.stringify({
        smokingAllowed: Boolean(formData.houseRules.smokingAllowed),
        eventsAllowed: Boolean(formData.houseRules.eventsAllowed),
        quietHours: {
          start: formData.houseRules.quietHours.start,
          end: formData.houseRules.quietHours.end
        },
        additionalRules: formData.houseRules.additionalRules.filter(rule => rule.trim() !== '')
      }));

      // Añadir location
      formDataToSend.append('location', JSON.stringify({
        coordinates: {
          lat: Number(formData.location.coordinates.lat) || null,
          lng: Number(formData.location.coordinates.lng) || null
        },
        neighborhood: formData.location.neighborhood,
        zipCode: formData.location.zipCode,
        publicTransport: formData.location.publicTransport.filter(transport => transport.trim() !== ''),
        nearbyPlaces: formData.location.nearbyPlaces.filter(place => place.trim() !== '')
      }));

      // Añadir availability
      formDataToSend.append('availability', JSON.stringify({
        minimumStay: Number(formData.availability.minimumStay) || 1,
        maximumStay: Number(formData.availability.maximumStay) || 365,
        instantBooking: Boolean(formData.availability.instantBooking),
        advanceNotice: Number(formData.availability.advanceNotice) || 1
      }));

      // Añadir imágenes nuevas
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(file => {
          formDataToSend.append('images', file);
        });
      }
    
      // Añadir IDs de imágenes a eliminar solo si existen
      if (imagesToDelete && imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      // Enviar la actualización
      const response = await fetch(`http://localhost:8080/flats/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la propiedad');
      }

      setMessage('¡Propiedad actualizada exitosamente!');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate(`/flats/${id}`);
      }, 2000);

    } catch (error) {
      console.error('Error completo:', error);
      setMessage(error.message || 'Error al actualizar la propiedad');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'rgb(23, 165, 170)', fontWeight: 600 }}>
          Actualizar Propiedad
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
                          placeholder="Detalles del estacionamiento"
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
                      placeholder="Regla adicional"
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
                  sx={{ 
                    mb: 2,
                    color: 'rgb(23, 165, 170)',
                    borderColor: 'rgb(23, 165, 170)',
                    '&:hover': {
                      borderColor: '#1FD1D7',
                      backgroundColor: 'rgba(31, 209, 215, 0.1)'
                    }
                  }}
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
                  sx={{ 
                    mb: 2,
                    color: 'rgb(23, 165, 170)',
                    borderColor: 'rgb(23, 165, 170)',
                    '&:hover': {
                      borderColor: '#1FD1D7',
                      backgroundColor: 'rgba(31, 209, 215, 0.1)'
                    }
                  }}
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
                  sx={{ 
                    color: 'rgb(23, 165, 170)',
                    borderColor: 'rgb(23, 165, 170)',
                    '&:hover': {
                      borderColor: '#1FD1D7',
                      backgroundColor: 'rgba(31, 209, 215, 0.1)'
                    }
                  }}
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
            
            {/* Imágenes Existentes */}
            {existingImages.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Imágenes actuales</Typography>
                <ImageList sx={{ width: '100%' }} cols={3} gap={8}>
                  {existingImages.map((image) => (
                    <ImageListItem key={image._id} sx={{ position: 'relative' }}>
                      <img
                        src={image.url}
                        alt={image.description || 'Property image'}
                        loading="lazy"
                        style={{ 
                          height: '200px',
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <IconButton
                        onClick={() => removeExistingImage(image._id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)'
                          }
                        }}
                      >
                        <DeleteIcon sx={{ color: '#d32f2f' }} />
                      </IconButton>
                      {image.isMainImage && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            bgcolor: 'rgba(23, 165, 170, 0.8)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}
                        >
                          Imagen Principal
                        </Box>
                      )}
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}

            {/* Subir Nuevas Imágenes */}
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
                    bgcolor: 'rgb(23, 165, 170)',
                    '&:hover': {
                      bgcolor: 'rgb(18, 140, 145)'
                    }
                  }}
                >
                  Agregar Nuevas Imágenes
                </Button>
              </label>

              {imagePreviews.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Nuevas imágenes a agregar:
                  </Typography>
                  <ImageList sx={{ width: '100%' }} cols={3} gap={8}>
                    {imagePreviews.map((preview, index) => (
                      <ImageListItem key={index} sx={{ position: 'relative' }}>
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
                          onClick={() => removeNewImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)'
                            }
                          }}
                        >
                          <DeleteIcon sx={{ color: '#d32f2f' }} />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </Box>
          </FormSection>

          {/* Botones de Acción */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={submitting}
              sx={{ 
                width: 200,
                color: '#0E3F33',
                borderColor: '#0E3F33',
                '&:hover': {
                  borderColor: 'rgb(23, 165, 170)',
                  backgroundColor: 'rgba(23, 165, 170, 0.1)'
                }
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ 
                width: 200,
                bgcolor: 'rgb(23, 165, 170)',
                '&:hover': {
                  bgcolor: 'rgb(18, 140, 145)'
                }
              }}
            >
              {submitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <span>Actualizando...</span>
                </Box>
              ) : (
                "Actualizar Propiedad"
              )}
            </Button>
          </Box>

          {/* Mensaje de estado */}
          {message && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 1,
                backgroundColor: message.includes('exitosamente') 
                  ? 'rgba(23, 165, 170, 0.1)'
                  : 'rgba(211, 47, 47, 0.1)',
                color: message.includes('exitosamente') 
                  ? 'rgb(23, 165, 170)'
                  : '#d32f2f'
              }}
            >
              <Typography align="center">{message}</Typography>
            </Box>
          )}
        </form>
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage('')}
          severity={message?.includes('exitosamente') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateFlat;