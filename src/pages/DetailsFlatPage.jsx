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
  Clear as ClearIcon
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};

            const [flatResponse, reviewsResponse, userResponse] = await Promise.all([
                axios.get(`http://localhost:8080/flats/${id}`),
                axios.get(`http://localhost:8080/messages/flat/${id}`),
                token ? axios.get('http://localhost:8080/users/profile', config) : null
            ].filter(Boolean));

            if (flatResponse?.data?.success) {
                setFlat(flatResponse.data.data);
                if (flatResponse.data.data.images?.length > 0) {
                    setMainImageUrl(flatResponse.data.data.images[0].url);
                }
            } else {
                throw new Error("No se pudo cargar la información del inmueble");
            }

            if (reviewsResponse?.data?.success) {
                setReviews(reviewsResponse.data.data);
            }

            if (userResponse?.data?.success) {
                const userFavorites = userResponse.data.data.favoriteFlats || [];
                setIsFavorite(userFavorites.includes(id));
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
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleSubmitReview = async () => {
  try {
      if (!newReview.content.trim()) {
          setSnackbar({
              open: true,
              message: 'Please write a review before submitting',
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
              message: 'Review submitted successfully',
              severity: 'success'
          });
      }
  } catch (err) {
      setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Error submitting review',
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
              message: !isFavorite ? 'Added to favorites' : 'Removed from favorites',
              severity: 'success'
          });
      }
  } catch (err) {
      setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Error updating favorites',
          severity: 'error'
      });
  }
};

// Constantes para controlar la visualización de elementos
const showMainImage = flat?.images?.length > 0 && mainImageUrl;
const showThumbnails = flat?.images?.length > 0;
const showAmenities = flat?.amenities && Object.keys(flat.amenities).some(key => flat.amenities[key]);
const showHouseRules = flat?.houseRules;
const showLocation = flat?.location;
const showAvailability = flat?.availability;
// Loading and Error States
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
        {error || "No data available"}
      </Alert>
    </Box>
  );
}

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
      {/* Images Section */}
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
                <Typography color="text.secondary">No image available</Typography>
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
                      alt={`View ${index + 1}`}
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
            {flat.title || 'No Title Available'}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <StyledRating value={flat.ratings?.overall || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({flat.ratings?.totalReviews || 0} reviews)
            </Typography>
          </Box>

          <StyledTabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
          >
            <StyledTab label="Details" />
            <StyledTab label="Location" />
            <StyledTab label="Amenities" />
          </StyledTabs>

          {/* Details Tab */}
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
                      {flat.bedrooms} {flat.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </Typography>
                  </FeatureItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FeatureItem>
                    <BathtubIcon sx={{ color: PRIMARY_COLOR }} />
                    <Typography>
                      {flat.bathrooms} {flat.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
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
                    <Typography>Max {flat.maxGuests} guests</Typography>
                  </FeatureItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FeatureItem>
                    <CalendarTodayIcon sx={{ color: PRIMARY_COLOR }} />
                    <Typography>Built in {flat.yearBuilt}</Typography>
                  </FeatureItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FeatureItem>
                    <HomeIcon sx={{ color: PRIMARY_COLOR }} />
                    <Typography>{flat.propertyType}</Typography>
                  </FeatureItem>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Description</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {flat.description}
              </Typography>

              {/* House Rules Section */}
{showHouseRules && (
  <>
    <Typography variant="h6" sx={{ mb: 2 }}>House Rules</Typography>
    <Box sx={{ mb: 3 }}>
      <List>
        <ListItem>
          <ListItemIcon>
            {flat.houseRules?.smokingAllowed ? 
              <CheckIcon sx={{ color: PRIMARY_COLOR }} /> : 
              <ClearIcon color="error" />}
          </ListItemIcon>
          <ListItemText 
            primary="Smoking"
            secondary={flat.houseRules?.smokingAllowed ? "Allowed" : "Not allowed"}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {flat.houseRules?.eventsAllowed ? 
              <CheckIcon sx={{ color: PRIMARY_COLOR }} /> : 
              <ClearIcon color="error" />}
          </ListItemIcon>
          <ListItemText 
            primary="Events"
            secondary={flat.houseRules?.eventsAllowed ? "Allowed" : "Not allowed"}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CalendarTodayIcon sx={{ color: PRIMARY_COLOR }} />
          </ListItemIcon>
          <ListItemText 
            primary="Quiet Hours"
            secondary={`${flat.houseRules?.quietHours?.start} - ${flat.houseRules?.quietHours?.end}`}
          />
        </ListItem>
      </List>

      {flat.houseRules?.additionalRules?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Additional Rules:</Typography>
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

          {/* Location Tab */}
{selectedTab === 1 && showLocation && (
  <Box>
    <Typography variant="h6" gutterBottom>Location Details</Typography>
    <List>
      <ListItem>
        <ListItemIcon>
          <LocationOnIcon sx={{ color: PRIMARY_COLOR }} />
        </ListItemIcon>
        <ListItemText 
          primary="Full Address"
          secondary={`${flat.streetName} ${flat.streetNumber}, ${flat.location?.neighborhood}, ${flat.city}`}
        />
      </ListItem>
      
      {flat.location?.zipCode && (
        <ListItem>
          <ListItemIcon>
            <HomeIcon sx={{ color: PRIMARY_COLOR }} />
          </ListItemIcon>
          <ListItemText 
            primary="Zip Code"
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
            primary="Coordinates"
            secondary={`${flat.location.coordinates.lat}, ${flat.location.coordinates.lng}`}
          />
        </ListItem>
      )}
    </List>

    {flat.location?.publicTransport?.length > 0 && (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Public Transport</Typography>
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
        <Typography variant="h6" gutterBottom>Nearby Places</Typography>
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

{/* Amenities Tab */}
{selectedTab === 2 && showAmenities && (
  <Box>
    <Typography variant="h6" gutterBottom>Available Amenities</Typography>
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
          <AmenityChip icon={<KitchenIcon />} label="Kitchen" />
        </Grid>
      )}
      {flat.amenities?.washer && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<WasherIcon />} label="Washer" />
        </Grid>
      )}
      {flat.amenities?.airConditioning && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<AcUnitIcon />} label="Air Conditioning" />
        </Grid>
      )}
      {flat.amenities?.pool && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<PoolIcon />} label="Pool" />
        </Grid>
      )}
      {flat.amenities?.gym && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<GymIcon />} label="Gym" />
        </Grid>
      )}
      {flat.amenities?.elevator && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<ElevatorIcon />} label="Elevator" />
        </Grid>
      )}
      {flat.amenities?.petsAllowed && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<PetsIcon />} label="Pets Allowed" />
        </Grid>
      )}
      {flat.amenities?.smokeAlarm && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<SecurityIcon />} label="Smoke Alarm" />
        </Grid>
      )}
      {flat.amenities?.firstAidKit && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<SecurityIcon />} label="First Aid Kit" />
        </Grid>
      )}
      {flat.amenities?.fireExtinguisher && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<SecurityIcon />} label="Fire Extinguisher" />
        </Grid>
      )}
      {flat.amenities?.securityCameras && (
        <Grid item xs={12} sm={6}>
          <AmenityChip icon={<SecurityIcon />} label="Security Cameras" />
        </Grid>
      )}
    </Grid>

    {/* Parking Section */}
    {flat.amenities?.parking?.available && (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Parking</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <AmenityChip 
              icon={<ParkingIcon />} 
              label={`Parking (${flat.amenities.parking.type})`} 
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
      {/* Sidebar/Right Panel */}
      <Grid item xs={12} md={4}>
        <StyledPaper>
          <PriceTag>
            <AttachMoneyIcon sx={{ color: PRIMARY_COLOR }} />
            {formatPrice(flat.rentPrice).replace('$', '')}
            <Typography variant="body1" color="text.secondary">
              /month
            </Typography>
          </PriceTag>

          <Typography
            variant="body1"
            sx={{
              mt: 2,
              p: 1,
              bgcolor: PRIMARY_COLOR,
              color: 'white',
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            Available from: {formatDate(flat.dateAvailable)}
          </Typography>

          {showAvailability && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Availability Details</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Minimum Stay"
                    secondary={`${flat.availability?.minimumStay || 1} days`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Maximum Stay"
                    secondary={`${flat.availability?.maximumStay || 365} days`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Advance Notice"
                    secondary={`${flat.availability?.advanceNotice || 1} days`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Instant Booking"
                    secondary={flat.availability?.instantBooking ? "Available" : "Not available"}
                  />
                </ListItem>
              </List>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Property Details</Typography>
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
                  label={`${flat.maxGuests} guests`}
                  variant="outlined"
                  sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                />
              </Grid>
              <Grid item xs={6}>
                <Chip
                  icon={<BedIcon sx={{ color: PRIMARY_COLOR }} />}
                  label={`${flat.bedrooms} beds`}
                  variant="outlined"
                  sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                />
              </Grid>
              <Grid item xs={6}>
                <Chip
                  icon={<BathtubIcon sx={{ color: PRIMARY_COLOR }} />}
                  label={`${flat.bathrooms} baths`}
                  variant="outlined"
                  sx={{ width: "100%", borderColor: PRIMARY_COLOR }}
                />
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Grid>

      {/* Reviews Section */}
      <Grid item xs={12}>
        <StyledPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Reviews ({reviews.length})</Typography>
            <StyledButton 
              variant="contained"
              onClick={() => setOpenReviewDialog(true)}
            >
              Write Review
            </StyledButton>
          </Box>

          {reviews.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No reviews yet. Be the first to review!
            </Typography>
          ) : (
            reviews.map((review) => (
              <ReviewContainer key={review._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={review.author?.profileImage} />
                  <Box>
                    <Typography variant="subtitle1">
                      {review.author?.firstName} {review.author?.lastName}
                    </Typography>
                    <StyledRating value={review.rating?.overall} readOnly />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {formatDate(review.atCreated)}
                  </Typography>
                </Box>
                <Typography>{review.content}</Typography>
              </ReviewContainer>
            ))
          )}
        </StyledPaper>
      </Grid>
    </Grid>

    {/* Review Dialog */}
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
      <DialogTitle sx={{ color: PRIMARY_COLOR }}>Write a Review</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Overall Rating</Typography>
          <StyledRating
            value={newReview.rating.overall}
            onChange={(_, value) => setNewReview(prev => ({
              ...prev,
              rating: { ...prev.rating, overall: value }
            }))}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" gutterBottom>Aspects</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {Object.entries(newReview.rating.aspects).map(([aspect, value]) => (
              <Grid item xs={12} key={aspect}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {aspect}
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
            placeholder="Share your experience..."
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
          variant="contained"
          onClick={() => setOpenReviewDialog(false)}
        >
          Cancel
        </StyledButton>
        <StyledButton 
          variant="contained"
          onClick={handleSubmitReview}
          disabled={!newReview.content.trim() || !newReview.rating.overall}
        >
          Submit
        </StyledButton>
      </DialogActions>
    </Dialog>

    {/* Snackbar Notifications */}
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
  </Box>
);
}

export default DetailsFlatPage;