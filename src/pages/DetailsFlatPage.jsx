import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Grid, Tabs, Tab, Paper, Rating, Chip, IconButton,
  TextField, Button, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Snackbar, List, ListItem,
  ListItemIcon, ListItemText
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
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  NavigateNext,
  NavigateBefore,
  ZoomIn as ZoomInIcon,
  Star as StarIcon
} from "@mui/icons-material";
import axios from "axios";

const PRIMARY_COLOR = 'rgb(23, 165, 170)';
const PRIMARY_HOVER = 'rgb(18, 140, 145)';

// Styled Components mejorados
const MainImage = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  borderRadius: "12px",
  transition: "transform 0.3s ease",
  cursor: "pointer",
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

const ImageViewerDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    margin: 0,
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
});

const ImageViewerContent = styled(DialogContent)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: 0,
  height: '100%',
});

const FullScreenImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100vh',
  objectFit: 'contain',
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

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
  color: 'white',
  '&:hover': {
    backgroundColor: PRIMARY_HOVER,
  },
  '&.MuiButton-outlined': {
    color: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    backgroundColor: 'transparent',
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

const ImageCounter = styled(Box)({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  padding: '4px 12px',
  borderRadius: 16,
  fontSize: '0.875rem',
});
const DetailsFlatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para el visor de imágenes
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mainImageUrl, setMainImageUrl] = useState("");
  
  // Estados principales
  const [selectedTab, setSelectedTab] = useState(0);
  const [flat, setFlat] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [flatOwner, setFlatOwner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estados para manejo de respuestas
  const [replyForms, setReplyForms] = useState({});
  const [replyContents, setReplyContents] = useState({});

  // Estado para formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: '',
    cedula: '',
    email: '',
    message: ''
  });

  // Estado para reseñas nuevas
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
  
  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        // Obtener datos del flat
        const flatResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/flats/${id}`, 
          config
        );

        if (flatResponse?.data?.success) {
          setFlat(flatResponse.data.data);
          if (flatResponse.data.data.images?.length > 0) {
            setMainImageUrl(flatResponse.data.data.images[0].url);
          }

          // Obtener datos del propietario
          if (typeof flatResponse.data.data.owner === 'string') {
            const ownerResponse = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/users/${flatResponse.data.data.owner}`,
              config
            );
            if (ownerResponse.data.success) {
              setFlatOwner(ownerResponse.data.data);
            }
          } else {
            setFlatOwner(flatResponse.data.data.owner);
          }
        } else {
          throw new Error("No se pudo cargar la información del inmueble");
        }

        // Obtener reseñas
        const reviewsResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/messages/flat/${id}`,
          config
        );
        if (reviewsResponse?.data?.success) {
          setReviews(reviewsResponse.data.data);
        }

        // Obtener datos del usuario actual
        if (token) {
          const userResponse = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/users/profile`,
            config
          );
          if (userResponse?.data?.success) {
            setCurrentUser(userResponse.data.data);
            const userFavorites = userResponse.data.data.favoriteFlats || [];
            setIsFavorite(userFavorites.includes(id));
          }
        }

      } catch (err) {
        console.error('Error al cargar datos:', err);
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Error al cargar los datos";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Funciones auxiliares
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
  // Funciones del visor de imágenes
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % flat.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? flat.images.length - 1 : prev - 1
    );
  };

  // Funciones de manejo de reseñas y respuestas
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
        `${import.meta.env.VITE_APP_API_URL}/messages/flat/${id}`,
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
      console.error('Error al enviar reseña:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al enviar la reseña',
        severity: 'error'
      });
    }
  };

  const handleReplySubmit = async (messageId) => {
    try {
      const content = replyContents[messageId];
      if (!content?.trim()) return;

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/messages/${messageId}/reply`,
        { content },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Actualizar las reseñas con la nueva respuesta
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
        
        // Limpiar el formulario
        setReplyForms(prev => ({ ...prev, [messageId]: false }));
        setReplyContents(prev => ({ ...prev, [messageId]: '' }));
        
        setSnackbar({
          open: true,
          message: 'Respuesta enviada exitosamente',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error al enviar respuesta:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al enviar la respuesta',
        severity: 'error'
      });
    }
  };

  const handleContactSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/flats/${id}/contact`,
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
      console.error('Error al enviar mensaje:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al enviar el mensaje',
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
        `${import.meta.env.VITE_APP_API_URL}/flats/${id}/favorite`,
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
      console.error('Error al actualizar favoritos:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al actualizar favoritos',
        severity: 'error'
      });
    }
  };
  // Renderizado condicional para estados de carga y error
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

  // Variables auxiliares para controlar la visualización
  const showMainImage = flat?.images?.length > 0 && mainImageUrl;
  const showThumbnails = flat?.images?.length > 0;
  const showAmenities = flat?.amenities && Object.keys(flat.amenities).some(key => flat.amenities[key]);
  const showHouseRules = flat?.houseRules;
  const showLocation = flat?.location;
  const showAvailability = flat?.availability;

  // Inicio del JSX principal
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
          aria-label="volver atrás"
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
          aria-label={isFavorite ? "quitar de favoritos" : "añadir a favoritos"}
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
                <Box position="relative">
                  <MainImage
                    src={mainImageUrl}
                    alt={flat.title}
                    onClick={() => handleImageClick(flat.images.findIndex(img => img.url === mainImageUrl))}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1
                  }}>
                    <IconButton
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { backgroundColor: 'white' }
                      }}
                      onClick={() => handleImageClick(flat.images.findIndex(img => img.url === mainImageUrl))}
                      aria-label="ampliar imagen"
                    >
                      <ZoomInIcon />
                    </IconButton>
                  </Box>
                  <ImageCounter>
                    {flat.images.findIndex(img => img.url === mainImageUrl) + 1} / {flat.images.length}
                  </ImageCounter>
                </Box>
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
                      <Box
                        sx={{
                          position: 'relative',
                          '&:hover .image-overlay': {
                            opacity: 1
                          }
                        }}
                      >
                        <ThumbnailImage
                          src={img.url}
                          alt={`Vista ${index + 1}`}
                          onClick={() => {
                            setMainImageUrl(img.url);
                            handleImageClick(index);
                          }}
                        />
                        <Box
                          className="image-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <ZoomInIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>

          {/* Image Viewer Dialog */}
          <ImageViewerDialog
            open={imageViewerOpen}
            onClose={() => setImageViewerOpen(false)}
            maxWidth={false}
            aria-labelledby="image-viewer-title"
          >
            <DialogTitle 
              id="image-viewer-title"
              sx={{ 
                position: 'absolute', 
                right: 0, 
                top: 0, 
                zIndex: 1,
                color: 'white'
              }}
            >
              <IconButton 
                onClick={() => setImageViewerOpen(false)}
                sx={{ color: 'white' }}
                aria-label="cerrar visor"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <ImageViewerContent>
              <NavigationButton
                onClick={handlePrevImage}
                sx={{ left: 16 }}
                aria-label="imagen anterior"
              >
                <NavigateBefore sx={{ fontSize: 40 }} />
              </NavigationButton>

              <FullScreenImage
                src={flat.images[selectedImageIndex]?.url}
                alt={`Vista ${selectedImageIndex + 1} de ${flat.title}`}
              />

              <NavigationButton
                onClick={handleNextImage}
                sx={{ right: 16 }}
                aria-label="siguiente imagen"
              >
                <NavigateNext sx={{ fontSize: 40 }} />
              </NavigationButton>

              <Box sx={{
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 2
              }}>
                {flat.images.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === selectedImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.2)',
                        backgroundColor: 'white'
                      }
                    }}
                    role="button"
                    aria-label={`Ver imagen ${index + 1}`}
                    tabIndex={0}
                  />
                ))}
              </Box>
            </ImageViewerContent>
          </ImageViewerDialog>
        </Grid>

        {/* Main Content Section */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
              {flat.title || 'Sin título disponible'}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <StyledRating 
                value={flat.ratings?.overall || 0} 
                precision={0.5} 
                readOnly 
                aria-label={`Calificación ${flat.ratings?.overall || 0} de 5`}
              />
              <Typography variant="body2" color="text.secondary">
                ({flat.ratings?.totalReviews || 0} reseñas)
              </Typography>
            </Box>

            <StyledTabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
              aria-label="información del inmueble"
            >
              <StyledTab label="Detalles" id="flat-tab-0" aria-controls="flat-tabpanel-0" />
              <StyledTab label="Ubicación" id="flat-tab-1" aria-controls="flat-tabpanel-1" />
              <StyledTab label="Comodidades" id="flat-tab-2" aria-controls="flat-tabpanel-2" />
            </StyledTabs>

            {/* Tab de Detalles */}
            <div
              role="tabpanel"
              hidden={selectedTab !== 0}
              id="flat-tabpanel-0"
              aria-labelledby="flat-tab-0"
            >
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

                          {flat.houseRules?.additionalRules?.map((rule, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckIcon sx={{ color: PRIMARY_COLOR }} />
                              </ListItemIcon>
                              <ListItemText primary={rule} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </div>

            {/* Tab de Ubicación */}
            <div
              role="tabpanel"
              hidden={selectedTab !== 1}
              id="flat-tabpanel-1"
              aria-labelledby="flat-tab-1"
            >
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
            </div>

            {/* Tab de Comodidades */}
            <div
              role="tabpanel"
              hidden={selectedTab !== 2}
              id="flat-tabpanel-2"
              aria-labelledby="flat-tab-2"
            >
              {selectedTab === 2 && showAmenities && (
                <Box>
                  <Typography variant="h6" gutterBottom>Comodidades Disponibles</Typography>
                  <Grid container spacing={2}>
                    {Object.entries({
                      wifi: 'WiFi',
                      tv: 'TV',
                      kitchen: 'Cocina',
                      washer: 'Lavadora',
                      airConditioning: 'Aire Acondicionado',
                      pool: 'Piscina',
                      gym: 'Gimnasio',
                      elevator: 'Ascensor',
                      petsAllowed: 'Mascotas Permitidas',
                      securityCameras: 'Cámaras de Seguridad'
                    }).map(([key, label]) => (
                      flat.amenities?.[key] && (
                        <Grid item xs={12} sm={6} key={key}>
                          <AmenityChip 
                            icon={
                              key === 'wifi' ? <WifiIcon /> :
                              key === 'tv' ? <TvIcon /> :
                              key === 'kitchen' ? <KitchenIcon /> :
                              key === 'washer' ? <WasherIcon /> :
                              key === 'airConditioning' ? <AcUnitIcon /> :
                              key === 'pool' ? <PoolIcon /> :
                              key === 'gym' ? <GymIcon /> :
                              key === 'elevator' ? <ElevatorIcon /> :
                              key === 'petsAllowed' ? <PetsIcon /> :
                              <SecurityIcon />
                            } 
                            label={label}
                          />
                        </Grid>
                      )
                    ))}
                  </Grid>

                  {/* Sección de Estacionamiento */}
                  {flat.amenities?.parking?.available && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Estacionamiento</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <AmenityChip 
                            icon={<ParkingIcon />} 
                            label={`${
                              flat.amenities.parking.type === 'free' ? 'Gratuito' :
                              flat.amenities.parking.type === 'paid' ? 'De pago' :
                              flat.amenities.parking.type === 'street' ? 'En la calle' :
                              'No disponible'
                            }`} 
                          />
                          {flat.amenities.parking.details && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                              {flat.amenities.parking.details}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}
            </div>
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
                startIcon={<LocationOnIcon />}
                aria-label="contactar al dueño"
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
  startIcon={<StarIcon />}
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
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar 
                      src={review.author?.profileImage}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {review.author?.firstName} {review.author?.lastName}
                          </Typography>
                          {review.author?._id === flatOwner?._id && (
                            <Chip
                              label="Propietario"
                              size="small"
                              sx={{
                                bgcolor: `${PRIMARY_COLOR}20`,
                                color: PRIMARY_COLOR,
                                fontWeight: 500
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.atCreated)}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 1 }}>
                        <StyledRating value={review.rating?.overall || 0} precision={0.5} readOnly size="small" />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {review.content}
                        </Typography>
                      </Box>

                      {/* Botón de respuesta - Solo visible para el propietario */}
                      {currentUser?._id === flatOwner?._id && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            startIcon={<ReplyIcon />}
                            onClick={() => setReplyForms(prev => ({ ...prev, [review._id]: !prev[review._id] }))}
                            sx={{ 
                              color: PRIMARY_COLOR,
                              '&:hover': {
                                bgcolor: `${PRIMARY_COLOR}10`
                              }
                            }}
                          >
                            Responder
                          </Button>
                        </Box>
                      )}

                      {/* Formulario de respuesta */}
                      {replyForms[review._id] && (
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Escribe tu respuesta..."
                            value={replyContents[review._id] || ''}
                            onChange={(e) => setReplyContents(prev => ({
                              ...prev,
                              [review._id]: e.target.value
                            }))}
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
                              onClick={() => setReplyForms(prev => ({ ...prev, [review._id]: false }))}
                              sx={{ color: 'text.secondary' }}
                            >
                              Cancelar
                            </Button>
                            <StyledButton
                              variant="contained"
                              onClick={() => handleReplySubmit(review._id)}
                              disabled={!replyContents[review._id]?.trim()}
                            >
                              Responder
                            </StyledButton>
                          </Box>
                        </Box>
                      )}
                      {/* Respuestas existentes */}
                      {review.replies?.map((reply) => (
                        <Box key={reply._id} sx={{ mt: 2, ml: 4, pl: 2, borderLeft: `2px solid ${PRIMARY_COLOR}20` }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar 
                              src={reply.author?.profileImage}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle2">
                                    {reply.author?.firstName} {reply.author?.lastName}
                                  </Typography>
                                  {reply.author?._id === flatOwner?._id && (
                                    <Chip
                                      label="Propietario"
                                      size="small"
                                      sx={{
                                        bgcolor: `${PRIMARY_COLOR}20`,
                                        color: PRIMARY_COLOR,
                                        fontWeight: 500,
                                        height: 20
                                      }}
                                    />
                                  )}
                                </Box>
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
          aria-labelledby="contact-dialog-title"
        >
          <DialogTitle id="contact-dialog-title" sx={{ color: PRIMARY_COLOR }}>
            Comunícate con el dueño del flat
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nombre completo"
                fullWidth
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
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
            <StyledButton 
              variant="contained"
              onClick={handleContactSubmit}
            >
              Enviar
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Diálogo de Reseña */}
        <Dialog 
          open={openReviewDialog} 
          onClose={() => setOpenReviewDialog(false)}
          maxWidth="sm"
          fullWidth
          aria-labelledby="review-dialog-title"
        >
          <DialogTitle id="review-dialog-title" sx={{ color: PRIMARY_COLOR }}>
            Escribir una Reseña
          </DialogTitle>
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
                      <Typography variant="body2">
                        {aspect === 'cleanliness' ? 'Limpieza' :
                         aspect === 'communication' ? 'Comunicación' :
                         aspect === 'location' ? 'Ubicación' :
                         aspect === 'accuracy' ? 'Precisión' :
                         aspect === 'value' ? 'Valor' : aspect}
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
                autoFocus
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
            <Button onClick={() => setOpenReviewDialog(false)}>
              Cancelar
            </Button>
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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