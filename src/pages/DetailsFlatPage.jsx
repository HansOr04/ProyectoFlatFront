import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Estilos personalizados
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

const PriceTag = styled(Typography)(({ theme }) => ({
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

const DetailsFlatPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [mainImageUrl, setMainImageUrl] = useState("");

  const flatData = {
    city: "Madrid",
    rating: 4.5,
    reviews: 120,
    address: {
      street: "Calle Mayor",
      number: 10,
      location: "Madrid, España",
    },
    specifications: {
      size: 80,
      airConditioning: true,
      yearBuilt: 2005,
    },
    price: "1.000",
    availability: "Disponible a partir de enero",
    mainImage:
      "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg",
    images: [
      "https://images.pexels.com/photos/3209045/pexels-photo-3209045.jpeg",
      "https://images.pexels.com/photos/3288102/pexels-photo-3288102.png",
      "https://images.pexels.com/photos/3288104/pexels-photo-3288104.png",
      "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg",
    ],
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImageUrl(imageUrl);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
      {/* Botón de regreso */}
      <IconButton
        sx={{ mb: 2 }}
        size="large"
        onClick={() => console.log("Navigate back")}
      >
        <ArrowBackIcon />
      </IconButton>

      <Grid container spacing={4}>
        {/* Sección de imágenes */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainImage
                src={mainImageUrl || flatData.mainImage}
                alt="Imagen principal del piso"
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {flatData.images.map((img, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <ThumbnailImage
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => handleThumbnailClick(img)}
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
              Piso en {flatData.city}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Rating value={flatData.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({flatData.reviews} opiniones)
              </Typography>
            </Box>

            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
              <Tab label="Detalles" />
              <Tab label="Ubicación" />
              <Tab label="Características" />
            </Tabs>

            {selectedTab === 0 && (
              <Box>
                <FeatureItem>
                  <LocationOnIcon />
                  <Typography>
                    {flatData.address.street}, {flatData.address.number}
                  </Typography>
                </FeatureItem>
                <FeatureItem>
                  <AcUnitIcon />
                  <Typography>
                    {flatData.specifications.airConditioning
                      ? "Con aire acondicionado"
                      : "Sin aire acondicionado"}
                  </Typography>
                </FeatureItem>
                <FeatureItem>
                  <CalendarTodayIcon />
                  <Typography>
                    Año de construcción: {flatData.specifications.yearBuilt}
                  </Typography>
                </FeatureItem>
              </Box>
            )}

            {selectedTab === 1 && (
              <Box
                sx={{ height: 300, bgcolor: "#f5f5f5", borderRadius: 2, p: 2 }}
              >
                <Typography variant="body1" textAlign="center">
                  Mapa de {flatData.address.location}
                </Typography>
              </Box>
            )}

            {selectedTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Especificaciones técnicas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Chip
                      label={`${flatData.specifications.size} m²`}
                      variant="outlined"
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={
                        flatData.specifications.airConditioning
                          ? "A/C"
                          : "Sin A/C"
                      }
                      variant="outlined"
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </StyledPaper>
        </Grid>

        {/* Panel lateral */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <PriceTag>
              <EuroIcon fontSize="large" />
              {flatData.price}
              <Typography variant="body1" color="text.secondary">
                /mes
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
              {flatData.availability}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Características destacadas
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Chip
                    label="WiFi"
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label="Amueblado"
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label="Ascensor"
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label="Parking"
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailsFlatPage;
