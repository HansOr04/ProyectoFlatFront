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
  Snackbar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import axios from "axios";

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

const PriceTag = styled('div')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: "bold",
    fontSize: "2rem",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  }));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const ReviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const AmenitiiesChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.MuiChip-outlined': {
    borderColor: theme.palette.primary.main,
  },
}));

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
          const [flatResponse, reviewsResponse] = await Promise.all([
            axios.get(`http://localhost:8080/flats/${id}`),
            axios.get(`http://localhost:8080/messages/flat/${id}`)
          ]);
      
          if (flatResponse.data.success) {
            setFlat(flatResponse.data.data);
            setMainImageUrl(flatResponse.data.data.images[0]?.url);
          }
      
          if (reviewsResponse.data.success) {
            setReviews(reviewsResponse.data.data);
          }
        } catch (err) {
          setError("Error loading data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, [id]);

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
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
        setReviews([response.data.data, ...reviews]);
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
        setIsFavorite(!isFavorite);
        setSnackbar({
          open: true,
          message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error updating favorites',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton
          size="large"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={handleToggleFavorite}
          color={isFavorite ? "error" : "default"}
        >
          <FavoriteIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Sección de imágenes */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainImage
                src={mainImageUrl}
                alt="Main property view"
              />
            </Grid>
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
          </Grid>
        </Grid>

        {/* Información principal */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {flat.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Rating value={flat.ratings?.overall || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({flat.ratings?.totalReviews || 0} reviews)
              </Typography>
            </Box>

            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
              <Tab label="Details" />
              <Tab label="Location" />
              <Tab label="Amenities" />
            </Tabs>

            {selectedTab === 0 && (
              <Box>
                <FeatureItem>
                  <LocationOnIcon />
                  <Typography>
                    {flat.streetName} {flat.streetNumber}, {flat.city}
                  </Typography>
                </FeatureItem>
                <FeatureItem>
                  <BedIcon />
                  <Typography>{flat.bedrooms} Bedrooms</Typography>
                </FeatureItem>
                <FeatureItem>
                  <BathtubIcon />
                  <Typography>{flat.bathrooms} Bathrooms</Typography>
                </FeatureItem>
                <FeatureItem>
                  <SquareFootIcon />
                  <Typography>{flat.areaSize} m²</Typography>
                </FeatureItem>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {flat.description}
                </Typography>
              </Box>
            )}

            {selectedTab === 1 && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Located in {flat.city}
                </Typography>
                {/* Aquí podrías integrar un mapa */}
              </Box>
            )}

            {selectedTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Available Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(flat.amenities || {}).map(([key, value]) => {
                    if (value === true) {
                      return (
                        <AmenitiiesChip
                          key={key}
                          label={key.replace(/([A-Z])/g, ' $1').trim()}
                          variant="outlined"
                        />
                      );
                    }
                    return null;
                  })}
                </Box>
              </Box>
            )}
          </StyledPaper>
        </Grid>

        {/* Panel lateral */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <PriceTag>
              <EuroIcon fontSize="large" />
              {flat.rentPrice}
              <Typography variant="body1" color="text.secondary">
                /month
              </Typography>
            </PriceTag>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                p: 1,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                borderRadius: 1,
              }}
            >
              Available from: {new Date(flat.dateAvailable).toLocaleDateString()}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Property Details
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Chip
                    label={`${flat.areaSize}m²`}
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={`${flat.bedrooms} beds`}
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={`${flat.bathrooms} baths`}
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={flat.propertyType}
                    variant="outlined"
                    sx={{ width: "100%" }}
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
              <Button 
                variant="contained" 
                onClick={() => setOpenReviewDialog(true)}
              >
                Write Review
              </Button>
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
                      <Rating value={review.rating?.overall} readOnly />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(review.atCreated).toLocaleDateString()}
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
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Overall Rating</Typography>
            <Rating
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
                    <Rating
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            disabled={!newReview.content.trim() || !newReview.rating.overall}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetailsFlatPage;