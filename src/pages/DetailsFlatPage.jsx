import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, 
  Typography, 
  Grid, 
  Tabs, 
  Tab, 
  Paper, 
  Rating, 
  Chip, 
  IconButton,
  TextField, 
  Button, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocationOn as LocationOnIcon,
  AcUnit as AcUnitIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Wifi as WifiIcon,
  Tv as TvIcon,
  Kitchen as KitchenIcon,
  LocalLaundryService as WasherIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Elevator as ElevatorIcon,
  LocalParking as ParkingIcon,
  Pets as PetsIcon,
  Security as SecurityIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import axios from "axios";

const PRIMARY_COLOR = 'rgb(23, 165, 170)';
const PRIMARY_HOVER = 'rgb(18, 140, 145)';

const MainImage = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  borderRadius: "12px",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const ThumbnailImage = styled("img")({
  width: "100%",
  height: "120px",
  objectFit: "cover",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  height: "100%",
}));

const PriceTag = styled('div')({
  color: PRIMARY_COLOR,
  fontWeight: "bold",
  fontSize: "2rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const FeatureItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "16px",
});

const ReviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },
}));

const AmenityChip = styled(Chip)({
  margin: "4px",
  backgroundColor: 'white',
  border: `1px solid ${PRIMARY_COLOR}`,
  '&:hover': {
    backgroundColor: `${PRIMARY_COLOR}20`,
  },
  '& .MuiSvgIcon-root': {
    color: PRIMARY_COLOR,
  },
});

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    color: PRIMARY_COLOR,
  },
});

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: PRIMARY_COLOR,
  },
});

const StyledButton = styled(Button)({
  backgroundColor: PRIMARY_COLOR,
  '&:hover': {
    backgroundColor: PRIMARY_HOVER,
  },
  '&.MuiButton-outlined': {
    color: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    '&:hover': {
      borderColor: PRIMARY_HOVER,
      backgroundColor: `${PRIMARY_COLOR}10`,
    },
  },
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: PRIMARY_COLOR,
  },
  '& .MuiRating-iconHover': {
    color: PRIMARY_HOVER,
  },
});

const DetailsFlatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [flat, setFlat] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [flatOwner, setFlatOwner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    cedula: '',
    email: '',
    message: ''
  });

  const [newReview, setNewReview] = useState({
    content: "",
    rating: {
      overall: 5,
      aspects: {
        cleanliness: 5,
        communication: 5,
        location: 5,
        accuracy: 5,
        value: 5
      }
    }
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
  
        // Primero obtenemos los datos del flat
        const flatResponse = await axios.get(`http://localhost:8080/flats/${id}`);
  
        if (flatResponse?.data?.success) {
          setFlat(flatResponse.data.data);
          if (flatResponse.data.data.images?.length > 0) {
            setMainImageUrl(flatResponse.data.data.images[0].url);
          }
  
          // Solo si tenemos el ID del propietario y es un string válido
          if (typeof flatResponse.data.data.owner === 'string') {
            // Obtener información del propietario con el token en los headers
            const ownerResponse = await axios.get(
              `http://localhost:8080/users/${flatResponse.data.data.owner}`,
              config
            );
            if (ownerResponse.data.success) {
              setFlatOwner(ownerResponse.data.data);
            }
          }
        } else {
          throw new Error("No se pudo cargar la información del inmueble");
        }
  
        // Obtener reseñas
        const reviewsResponse = await axios.get(
          `http://localhost:8080/messages/flat/${id}`,
          config
        );
        if (reviewsResponse?.data?.success) {
          setReviews(reviewsResponse.data.data);
        }
  
        // Si hay token, obtener perfil del usuario actual
        if (token) {
          const userResponse = await axios.get(
            'http://localhost:8080/users/profile',
            config
          );
          if (userResponse?.data?.success) {
            setCurrentUser(userResponse.data.data);
            const userFavorites = userResponse.data.data.favoriteFlats || [];
            setIsFavorite(userFavorites.includes(id));
          }
        }
  
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Error al cargar los datos";
        setError(errorMessage);
        console.error("Error detallado:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const formatPrice = (price) => {
    return price.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContactSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/flats/${id}/contact`,
        contactForm,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Mensaje enviado correctamente',
          severity: 'success'
        });
        setOpenContactDialog(false);
        setContactForm({ name: '', cedula: '', email: '', message: '' });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al enviar el mensaje',
        severity: 'error'
      });
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!newReview.content.trim()) {
        setSnackbar({
          open: true,
          message: 'Por favor, escribe una reseña antes de enviar',
          severity: 'error'
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/messages/flat/${id}`,
        {
          content: newReview.content,
          flatID: id,
          rating: {
            overall: newReview.rating.overall,
            aspects: newReview.rating.aspects
          }
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setReviews(prevReviews => [response.data.data, ...prevReviews]);
        setOpenReviewDialog(false);
        setNewReview({ 
          content: "", 
          rating: { 
            overall: 5,
            aspects: {
              cleanliness: 5,
              communication: 5,
              location: 5,
              accuracy: 5,
              value: 5
            }
          }
        });
        setSnackbar({
          open: true,
          message: 'Reseña enviada exitosamente',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al enviar la reseña',
        severity: 'error'
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/flats/${id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setIsFavorite(prev => !prev);
        setSnackbar({
          open: true,
          message: !isFavorite ? 'Añadido a favoritos' : 'Eliminado de favoritos',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al actualizar favoritos',
        severity: 'error'
      });
    }
  };

  const handleReplySubmit = async (messageId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/messages/${messageId}/reply`,
        { content },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review._id === messageId 
              ? { 
                  ...review, 
                  replies: [...(review.replies || []), response.data.data] 
                }
              : review
          )
        );
        
        setSnackbar({
          open: true,
          message: 'Respuesta enviada exitosamente',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al enviar la respuesta',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: PRIMARY_COLOR }} />
      </Box>
    );
  }

  if (error || !flat) {
    return (
      <Box p={4}>
        <Alert severity="error">
          {error || "No hay datos disponibles"}
        </Alert>
      </Box>
    );
  }

  const showMainImage = flat?.images?.length > 0 && mainImageUrl;
  const showThumbnails = flat?.images?.length > 0;
  const showAmenities = flat?.amenities && Object.keys(flat.amenities).some(key => flat.amenities[key]);
  const showHouseRules = flat?.houseRules;
  const showLocation = flat?.location;
  const showAvailability = flat?.availability;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton
          size="large"
          onClick={() => navigate(-1)}
          sx={{ 
            backgroundColor: 'white', 
            boxShadow: 1,
            '&:hover': {
              backgroundColor: `${PRIMARY_COLOR}10`,
            }
          }}
        >
          <ArrowBackIcon sx={{ color: PRIMARY_COLOR }} />
        </IconButton>
        <IconButton
          onClick={handleToggleFavorite}
          sx={{ 
            backgroundColor: 'white',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: isFavorite ? '#ffebee' : `${PRIMARY_COLOR}10`,
            }
          }}
        >
          <FavoriteIcon color={isFavorite ? "error" : "default"} />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Sección de Imágenes */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {showMainImage ? (
                <MainImage
                  src={mainImageUrl}
                  alt={flat.title}
                />
              ) : (
                <Box sx={{ 
                  height: 400, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 2
                }}>
                  <Typography color="text.secondary">No hay imagen disponible</Typography>
                </Box>
              )}
            </Grid>
            {showThumbnails && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {flat.images.map((img, index) => (
                    <Grid item xs={6} md={3} key={img._id || index}>
                      <ThumbnailImage
                        src={img.url}
                        alt={`Vista ${index + 1}`}
                        onClick={() => setMainImageUrl(img.url)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Main Content Section */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
              {flat.title || 'Sin título disponible'}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <StyledRating value={flat.ratings?.overall || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({flat.ratings?.totalReviews || 0} reseñas)
              </Typography>
            </Box>

            <StyledTabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
              <StyledTab label="Detalles" />
              <StyledTab label="Ubicación" />
              <StyledTab label="Comodidades" />
            </StyledTabs>

            {/* Tab de Detalles */}
            {selectedTab === 0 && (
              <Box>
                <FeatureItem>
                  <LocationOnIcon sx={{ color: PRIMARY_COLOR }} />
                  <Typography>
                    {`${flat.streetName} ${flat.streetNumber}, ${flat.location?.neighborhood || ''}, ${flat.city}`}
                  </Typography>
                </FeatureItem>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FeatureItem>
                      <BedIcon sx={{ color: PRIMARY_COLOR }} />
                      <Typography>
                        {flat.bedrooms} {flat.bedrooms === 1 ? 'Dormitorio' : 'Dormitorios'}
                      </Typography>
                    </FeatureItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FeatureItem>
                      <BathtubIcon sx={{ color: PRIMARY_COLOR }} />
                      <Typography>
                        {flat.bathrooms} {flat.bathrooms === 1 ? 'Baño' : 'Baños'}
                      </Typography>
                    </FeatureItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FeatureItem>
                      <SquareFootIcon sx={{ color: PRIMARY_COLOR }} />
                      <Typography>{flat.areaSize} m²</Typography>
                    </FeatureItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FeatureItem>
                      <PersonIcon sx={{ color: PRIMARY_COLOR }} />
                      <Typography>Máximo {flat.maxGuests} huéspedes</Typography>
                    </FeatureItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FeatureItem>
                      <CalendarTodayIcon sx={{ color: PRIMARY_COLOR }} />
                      <Typography>Construido en {flat.yearBuilt}</Typography>
                    </FeatureItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FeatureItem>
                      <HomeIcon sx={{ color: PRIMARY_COLOR }} />
                      <Typography>
                        {flat.propertyType === 'apartment' && 'Apartamento'}
                        {flat.propertyType === 'house' && 'Casa'}
                        {flat.propertyType === 'studio' && 'Estudio'}
                        {flat.propertyType === 'loft' && 'Loft'}
                        {flat.propertyType === 'room' && 'Habitación'}
                      </Typography>
                    </FeatureItem>
                  </Grid>
                </Grid>
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Descripción</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {flat.description}
                </Typography>

                {/* Sección de Reglas de la Casa */}
                {showHouseRules && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>Reglas de la Casa</Typography>
                    <Box sx={{ mb: 3 }}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            {flat.houseRules?.smokingAllowed ? 
                              <CheckIcon sx={{ color: PRIMARY_COLOR }} /> : 
                              <ClearIcon color="error" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary="Fumar"
                            secondary={flat.houseRules?.smokingAllowed ? "Permitido" : "No permitido"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {flat.houseRules?.eventsAllowed ? 
                              <CheckIcon sx={{ color: PRIMARY_COLOR }} /> : 
                              <ClearIcon color="error" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary="Eventos"
                            secondary={flat.houseRules?.eventsAllowed ? "Permitido" : "No permitido"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarTodayIcon sx={{ color: PRIMARY_COLOR }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Horario de silencio"
                            secondary={`${flat.houseRules?.quietHours?.start} - ${flat.houseRules?.quietHours?.end}`}
                          />
                        </ListItem>
                      </List>

                      {flat.houseRules?.additionalRules?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>Reglas adicionales:</Typography>
                          <List dense>
                            {flat.houseRules.additionalRules.map((rule, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckIcon sx={{ color: PRIMARY_COLOR, fontSize: '1rem' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={rule}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            )}

            {/* Tab de Ubicación */}
            {selectedTab === 1 && showLocation && (
              <Box>
                <Typography variant="h6" gutterBottom>Detalles de la Ubicación</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon sx={{ color: PRIMARY_COLOR }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dirección Completa"
                      secondary={`${flat.streetName} ${flat.streetNumber}, ${flat.location?.neighborhood}, ${flat.city}`}
                    />
                  </ListItem>
                  
                  {flat.location?.zipCode && (
                    <ListItem>
                      <ListItemIcon>
                        <HomeIcon sx={{ color: PRIMARY_COLOR }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Código Postal"
                        secondary={flat.location.zipCode}
                      />
                    </ListItem>
                  )}

                  {flat.location?.coordinates?.lat && flat.location?.coordinates?.lng && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon sx={{ color: PRIMARY_COLOR }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Coordenadas"
                        secondary={`${flat.location.coordinates.lat}, ${flat.location.coordinates.lng}`}
                      />
                    </ListItem>
                  )}
                </List>

                {flat.location?.publicTransport?.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Transporte Público</Typography>
                    <List dense>
                      {flat.location.publicTransport.map((transport, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckIcon sx={{ color: PRIMARY_COLOR }} fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={transport} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {flat.location?.nearbyPlaces?.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Lugares Cercanos</Typography>
                    <List dense>
                      {flat.location.nearbyPlaces.map((place, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LocationOnIcon sx={{ color: PRIMARY_COLOR }} fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={place} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}

            {/* Tab de Comodidades */}
            {selectedTab === 2 && showAmenities && (
              <Box>
                <Typography variant="h6" gutterBottom>Comodidades Disponibles</Typography>
                <Grid container spacing={2}>
                  {flat.amenities?.wifi && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<WifiIcon />} label="WiFi" />
                    </Grid>
                  )}
                  {flat.amenities?.tv && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<TvIcon />} label="TV" />
                    </Grid>
                  )}
                  {flat.amenities?.kitchen && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<KitchenIcon />} label="Cocina" />
                    </Grid>
                  )}
                  {flat.amenities?.washer && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<WasherIcon />} label="Lavadora" />
                    </Grid>
                  )}
                  {flat.amenities?.airConditioning && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<AcUnitIcon />} label="Aire Acondicionado" />
                    </Grid>
                  )}
                  {flat.amenities?.pool && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<PoolIcon />} label="Piscina" />
                    </Grid>
                  )}
                  {flat.amenities?.gym && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<GymIcon />} label="Gimnasio" />
                    </Grid>
                  )}
                  {flat.amenities?.elevator && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<ElevatorIcon />} label="Ascensor" />
                    </Grid>
                  )}
                  {flat.amenities?.petsAllowed && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<PetsIcon />} label="Mascotas Permitidas" />
                    </Grid>
                  )}
                  {flat.amenities?.smokeAlarm && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<SecurityIcon />} label="Alarma de Humo" />
                    </Grid>
                  )}
                  {flat.amenities?.firstAidKit && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<SecurityIcon />} label="Botiquín" />
                    </Grid>
                  )}
                  {flat.amenities?.fireExtinguisher && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<SecurityIcon />} label="Extintor" />
                    </Grid>
                  )}
                  {flat.amenities?.securityCameras && (
                    <Grid item xs={12} sm={6}>
                      <AmenityChip icon={<SecurityIcon />} label="Cámaras de Seguridad" />
                    </Grid>
                  )}
                </Grid>
                {/* Sección de Estacionamiento */}
                {flat.amenities?.parking?.available && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Estacionamiento</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <AmenityChip 
                          icon={<ParkingIcon />} 
                          label={`Estacionamiento (${
                            flat.amenities.parking.type === 'free' ? 'Gratuito' :
                            flat.amenities.parking.type === 'paid' ? 'De pago' :
                            flat.amenities.parking.type === 'street' ? 'En la calle' :
                            'No disponible'
                          })`} 
                        />
                      </Grid>
                    </Grid>
                    {flat.amenities.parking.details && (
                      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        {flat.amenities.parking.details}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </StyledPaper>
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <PriceTag>
              <AttachMoneyIcon sx={{ color: PRIMARY_COLOR }} />
              {formatPrice(flat.rentPrice).replace('$', '')}
              <Typography variant="body1" color="text.secondary">
                /mes
              </Typography>
            </PriceTag>

            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  p: 1,
                  bgcolor: PRIMARY_COLOR,
                  color: 'white',
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                Disponible desde: {formatDate(flat.dateAvailable)}
              </Typography>

              <StyledButton
                variant="contained"
                fullWidth
                onClick={() => setOpenContactDialog(true)}
                sx={{
                  backgroundColor: PRIMARY_COLOR,
                  '&:hover': {
                    backgroundColor: PRIMARY_HOVER,
                  }
                }}
              >
                Contactar al dueño
              </StyledButton>
            </Box>

            {showAvailability && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Detalles de Disponibilidad</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Estancia mínima"
                      secondary={`${flat.availability?.minimumStay || 1} días`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Estancia máxima"
                      secondary={`${flat.availability?.maximumStay || 365} días`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Aviso previo"
                      secondary={`${flat.availability?.advanceNotice || 1} días`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Reserva instantánea"
                      secondary={flat.availability?.instantBooking ? "Disponible" : "No disponible"}
                    />
                  </ListItem>
                </List>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Detalles de la Propiedad</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Chip
                    icon={<SquareFootIcon sx={{ color: PRIMARY_COLOR }} />}
                    label={`${flat.areaSize}m²`}
                    variant="outlined"
                    sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    icon={<PersonIcon sx={{ color: PRIMARY_COLOR }} />}
                    label={`${flat.maxGuests} huéspedes`}
                    variant="outlined"
                    sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    icon={<BedIcon sx={{ color: PRIMARY_COLOR }} />}
                    label={`${flat.bedrooms} dormitorios`}
                    variant="outlined"
                    sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    icon={<BathtubIcon sx={{ color: PRIMARY_COLOR }} />}
                    label={`${flat.bathrooms} baños`}
                    variant="outlined"
                    sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Grid>
        {/* Sección de Reseñas */}
        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Reseñas ({reviews.length})</Typography>
              <StyledButton 
                variant="contained"
                onClick={() => setOpenReviewDialog(true)}
              >
                Escribir Reseña
              </StyledButton>
            </Box>

            {reviews.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Aún no hay reseñas. ¡Sé el primero en dejar una!
              </Typography>
            ) : (
              reviews.map((review) => (
                <Paper 
                  key={review._id}
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    mb: 2, 
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={review.author?.profileImage}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {review.author?.firstName} {review.author?.lastName}
                          {review.author?._id === flatOwner?._id && (
                            <Typography 
                              component="span" 
                              sx={{ 
                                ml: 1,
                                px: 1, 
                                py: 0.5, 
                                bgcolor: `${PRIMARY_COLOR}20`,
                                color: PRIMARY_COLOR,
                                borderRadius: 1,
                                fontSize: '0.75rem'
                              }}
                            >
                              Propietario
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.atCreated)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                        <StyledRating value={review.rating?.overall || 0} precision={0.5} readOnly size="small" />
                      </Box>
                      <Typography variant="body1">
                        {review.content}
                      </Typography>

                      {/* Aspectos calificados */}
                      {review.rating?.aspects && (
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {Object.entries(review.rating.aspects).map(([aspect, value]) => (
                            <Box key={aspect} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {aspect === 'cleanliness' ? 'Limpieza' :
                                 aspect === 'communication' ? 'Comunicación' :
                                 aspect === 'location' ? 'Ubicación' :
                                 aspect === 'accuracy' ? 'Precisión' :
                                 aspect === 'value' ? 'Valor' : aspect}:
                              </Typography>
                              <StyledRating value={value} readOnly size="small" />
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Sección de respuestas */}
                  <Box sx={{ ml: 7 }}>
                    {((currentUser?._id === flatOwner?._id && !review.parentMessage) ||
                      (review.parentMessage && review.author?._id === flatOwner?._id && currentUser?._id === review.parentMessage.author?._id)) && (
                      <Button
                        startIcon={<ReplyIcon />}
                        onClick={() => {
                          const messageElement = document.getElementById(`reply-form-${review._id}`);
                          if (messageElement) {
                            messageElement.style.display = messageElement.style.display === 'none' ? 'block' : 'none';
                          }
                        }}
                        sx={{ 
                          color: PRIMARY_COLOR,
                          '&:hover': {
                            bgcolor: `${PRIMARY_COLOR}10`
                          }
                        }}
                      >
                        Responder
                      </Button>
                    )}

                    {/* Formulario de respuesta */}
                    <Box id={`reply-form-${review._id}`} sx={{ display: 'none', mt: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Escribe tu respuesta..."
                        onChange={(e) => {
                          const replyContent = e.target.value;
                          if (replyContent.trim()) {
                            const messageElement = document.getElementById(`reply-button-${review._id}`);
                            if (messageElement) {
                              messageElement.disabled = false;
                            }
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: PRIMARY_COLOR,
                            }
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
                        <Button 
                          onClick={() => {
                            const messageElement = document.getElementById(`reply-form-${review._id}`);
                            if (messageElement) {
                              messageElement.style.display = 'none';
                            }
                          }}
                          sx={{ color: 'text.secondary' }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          id={`reply-button-${review._id}`}
                          variant="contained"
                          onClick={(e) => {
                            const form = document.getElementById(`reply-form-${review._id}`);
                            const content = form?.querySelector('textarea')?.value;
                            if (content) {
                              handleReplySubmit(review._id, content);
                              form.style.display = 'none';
                            }
                          }}
                          disabled={true}
                          sx={{
                            bgcolor: PRIMARY_COLOR,
                            '&:hover': {
                              bgcolor: PRIMARY_HOVER
                            }
                          }}
                        >
                          Responder
                        </Button>
                      </Box>
                    </Box>

                    {/* Mostrar respuestas existentes */}
                    {review.replies?.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {review.replies.map((reply) => (
                          <Box key={reply._id} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar 
                                src={reply.author?.profileImage}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2">
                                    {reply.author?.firstName} {reply.author?.lastName}
                                    {reply.author?._id === flatOwner?._id && (
                                      <Typography 
                                        component="span" 
                                        sx={{ 
                                          ml: 1,
                                          px: 1, 
                                          py: 0.5, 
                                          bgcolor: `${PRIMARY_COLOR}20`,
                                          color: PRIMARY_COLOR,
                                          borderRadius: 1,
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        Propietario
                                      </Typography>
                                    )}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(reply.atCreated)}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {reply.content}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))
            )}
          </StyledPaper>
        </Grid>
        {/* Diálogo de Contacto */}
        <Dialog
          open={openContactDialog}
          onClose={() => setOpenContactDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: PRIMARY_COLOR }}>Comunícate con el dueño del flat</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nombre completo"
                fullWidth
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                label="Cédula"
                fullWidth
                value={contactForm.cedula}
                onChange={(e) => setContactForm(prev => ({ ...prev, cedula: e.target.value }))}
              />
              <TextField
                label="Correo electrónico"
                fullWidth
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              />
              <TextField
                label="Mensaje"
                multiline
                rows={4}
                fullWidth
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenContactDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleContactSubmit}
              sx={{ backgroundColor: PRIMARY_COLOR }}
            >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de Reseña */}
        <Dialog 
          open={openReviewDialog} 
          onClose={() => setOpenReviewDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
            }
          }}
        >
          <DialogTitle sx={{ color: PRIMARY_COLOR }}>Escribir una Reseña</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Calificación General</Typography>
              <StyledRating
                value={newReview.rating.overall}
                onChange={(_, value) => setNewReview(prev => ({
                  ...prev,
                  rating: { ...prev.rating, overall: value }
                }))}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle1" gutterBottom>Aspectos</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {Object.entries(newReview.rating.aspects).map(([aspect, value]) => (
                  <Grid item xs={12} key={aspect}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {
                          aspect === 'cleanliness' ? 'Limpieza' :
                          aspect === 'communication' ? 'Comunicación' :
                          aspect === 'location' ? 'Ubicación' :
                          aspect === 'accuracy' ? 'Precisión' :
                          aspect === 'value' ? 'Valor' : aspect
                        }
                      </Typography>
                      <StyledRating
                        value={value}
                        onChange={(_, newValue) => setNewReview(prev => ({
                          ...prev,
                          rating: {
                            ...prev.rating,
                            aspects: {
                              ...prev.rating.aspects,
                              [aspect]: newValue
                            }
                          }
                        }))}
                        size="small"
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Comparte tu experiencia..."
                value={newReview.content}
                onChange={(e) => setNewReview(prev => ({ 
                  ...prev, 
                  content: e.target.value 
                }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <StyledButton 
              variant="outlined"
              onClick={() => setOpenReviewDialog(false)}
            >
              Cancelar
            </StyledButton>
            <StyledButton 
              variant="contained"
              onClick={handleSubmitReview}
              disabled={!newReview.content.trim() || !newReview.rating.overall}
            >
              Publicar
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar para Notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            variant="filled"
            sx={{
              backgroundColor: snackbar.severity === 'success' ? PRIMARY_COLOR : undefined
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default DetailsFlatPage;