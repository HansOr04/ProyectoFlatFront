import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
  Stack,
  Rating,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  SquareFoot as SquareFootIcon,
  AcUnit as AcUnitIcon,
  Business as BusinessIcon,  // Asegúrate de que esta importación esté presente
  Update as UpdateIcon,
  EventAvailable as EventAvailableIcon,
  Photo as PhotoIcon,
  Home as HomeIcon,
  ArrowForward as ArrowForwardIcon,
  SingleBed as SingleBedIcon,
  Bathtub as BathtubIcon,
  Group as GroupIcon,
  Wifi as WifiIcon,
  Tv as TvIcon,
  Kitchen as KitchenIcon,
  LocalLaundryService as WasherIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Elevator as ElevatorIcon,
  LocalParking as ParkingIcon,
  Pets as PetsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Estilos personalizados
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  height: '280px', // Aumentado para acomodar más contenido
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '300px',
  height: '280px', // Actualizado para mantener proporción
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const ImageCount = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.75rem'
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(2),
  position: 'relative'
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#f0f7f7',
  '& .MuiChip-icon': {
    color: '#17A5AA',
    fontSize: '1rem'
  },
  height: '24px',
  '& .MuiChip-label': {
    fontSize: '0.75rem',
    padding: '0 8px'
  }
}));

const AmenitiesWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1)
}));

const AmenityChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#f0f7f7',
  height: '20px',
  '& .MuiChip-label': {
    fontSize: '0.7rem',
    padding: '0 6px'
  },
  '& .MuiChip-icon': {
    color: '#17A5AA',
    fontSize: '0.9rem'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#17A5AA',
  color: 'white',
  '&:hover': {
    backgroundColor: '#148f94'
  },
  fontSize: '0.875rem',
  textTransform: 'none'
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#17A5AA',
  },
  '& .MuiRating-iconHover': {
    color: '#148f94',
  }
}));

const PropertyCard = ({ flat, isFavorite, onToggleFavorite, onViewDetails }) => {
  // Función para obtener la imagen principal
  const getMainImage = () => {
    const mainImage = flat.images?.find(img => img.isMainImage);
    return mainImage?.url || flat.images?.[0]?.url || 'https://via.placeholder.com/300x280';
  };

  // Función para formatear precios
  const formatPrice = (price) => {
    return price.toLocaleString('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  // Función para formatear fechas
  const formatSimpleDate = (date) => {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Función para obtener los amenities principales
  const getMainAmenities = () => {
    const amenities = [];
    if (flat.amenities) {
      if (flat.amenities.wifi) amenities.push({ icon: <WifiIcon />, label: 'WiFi' });
      if (flat.amenities.tv) amenities.push({ icon: <TvIcon />, label: 'TV' });
      if (flat.amenities.kitchen) amenities.push({ icon: <KitchenIcon />, label: 'Cocina' });
      if (flat.amenities.washer) amenities.push({ icon: <WasherIcon />, label: 'Lavadora' });
      if (flat.amenities.airConditioning) amenities.push({ icon: <AcUnitIcon />, label: 'A/C' });
      if (flat.amenities.pool) amenities.push({ icon: <PoolIcon />, label: 'Piscina' });
      if (flat.amenities.gym) amenities.push({ icon: <GymIcon />, label: 'Gimnasio' });
      if (flat.amenities.elevator) amenities.push({ icon: <ElevatorIcon />, label: 'Ascensor' });
      if (flat.amenities.parking?.available) {
        amenities.push({ 
          icon: <ParkingIcon />, 
          label: `Parking ${flat.amenities.parking.type === 'free' ? 'gratis' : 'pagado'}`
        });
      }
      if (flat.amenities.petsAllowed) amenities.push({ icon: <PetsIcon />, label: 'Mascotas' });
      if (flat.amenities.securityCameras) amenities.push({ icon: <SecurityIcon />, label: 'Seguridad' });
    }
    return amenities.slice(0, 8); // Mostrar solo los 8 primeros
  };

  return (
    <StyledCard>
      <Box sx={{ position: 'relative', width: 300 }}>
        <StyledCardMedia
          component="img"
          image={getMainImage()}
          alt={flat.title || `Propiedad en ${flat.city}`}
        />
        <ImageCount>
          <PhotoIcon sx={{ fontSize: '1rem' }} />
          {flat.images?.length || 0} fotos
        </ImageCount>
      </Box>

      <ContentWrapper>
        {/* Header con título, ubicación y rating */}
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <HomeIcon sx={{ color: '#17A5AA', fontSize: '1.2rem' }} />
                <Typography variant="h6" sx={{ color: '#17A5AA', fontWeight: 600 }}>
                  {flat.title || `${flat.streetName} ${flat.streetNumber}`}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon sx={{ color: '#666', fontSize: '1rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {flat.city}
                </Typography>
              </Stack>
            </Box>
            {flat.ratings && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StyledRating
                  value={flat.ratings.overall}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  ({flat.ratings.totalReviews})
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Características principales */}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
          <InfoChip
            icon={<SingleBedIcon />}
            label={`${flat.bedrooms} dormitorio${flat.bedrooms !== 1 ? 's' : ''}`}
            size="small"
          />
          <InfoChip
            icon={<BathtubIcon />}
            label={`${flat.bathrooms} baño${flat.bathrooms !== 1 ? 's' : ''}`}
            size="small"
          />
          <InfoChip
            icon={<SquareFootIcon />}
            label={`${flat.areaSize}m²`}
            size="small"
          />
          <InfoChip
            icon={<GroupIcon />}
            label={`${flat.maxGuests} huéspedes`}
            size="small"
          />
          <InfoChip
  icon={<BusinessIcon />}  // Cambiado de Business a BusinessIcon
  label={`Año ${flat.yearBuilt}`}
  size="small"
/>
        </Stack>

        {/* Amenities */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#666' }}>
            Amenities
          </Typography>
          <AmenitiesWrapper>
            {getMainAmenities().map((amenity, index) => (
              <Tooltip key={index} title={amenity.label}>
                <AmenityChip
                  icon={amenity.icon}
                  label={amenity.label}
                  size="small"
                />
              </Tooltip>
            ))}
          </AmenitiesWrapper>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Fechas y precio */}
        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <EventAvailableIcon sx={{ color: '#666', fontSize: '0.875rem' }} />
              <Typography variant="caption" color="text.secondary">
                Disponible: {formatSimpleDate(flat.dateAvailable)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <UpdateIcon sx={{ color: '#666', fontSize: '0.875rem' }} />
              <Typography variant="caption" color="text.secondary">
                Actualizado: {formatSimpleDate(flat.atUpdated)}
              </Typography>
            </Stack>
          </Stack>

          {/* Precio y acciones */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#17A5AA' }}>
              {formatPrice(flat.rentPrice)}
              <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                /mes
              </Typography>
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => onToggleFavorite(flat._id)}
                sx={{
                  bgcolor: 'white',
                  boxShadow: 1,
                  '&:hover': { bgcolor: '#fff5f5' }
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon sx={{ color: '#ff4d4d' }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: '#666' }} />
                )}
              </IconButton>
              <StyledButton
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => onViewDetails(flat._id)}
              >
                Ver detalles
              </StyledButton>
            </Stack>
          </Stack>
        </Box>
      </ContentWrapper>
    </StyledCard>
  );
};

export default PropertyCard;