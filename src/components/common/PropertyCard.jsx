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
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  SquareFoot as SquareFootIcon,
  AcUnit as AcUnitIcon,
  Business as BusinessIcon,
  Update as UpdateIcon,
  EventAvailable as EventAvailableIcon,
  Photo as PhotoIcon,
  Home as HomeIcon,
  ArrowForward as ArrowForwardIcon
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
  height: '220px',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '300px',
  height: '220px',
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

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#17A5AA',
  color: 'white',
  '&:hover': {
    backgroundColor: '#148f94'
  },
  fontSize: '0.875rem',
  textTransform: 'none'
}));

const PropertyCard = ({ flat, isFavorite, onToggleFavorite, onViewDetails }) => {
  // Función para obtener la imagen principal
  const getMainImage = () => {
    const mainImage = flat.images?.find(img => img.isMainImage);
    return mainImage?.url || flat.images?.[0]?.url || 'https://via.placeholder.com/300x220';
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
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <StyledCard>
      <Box sx={{ position: 'relative', width: 300 }}>
        <StyledCardMedia
          component="img"
          image={getMainImage()}
          alt={`Propiedad en ${flat.city}`}
        />
        <ImageCount>
          <PhotoIcon sx={{ fontSize: '1rem' }} />
          {flat.images?.length || 0} fotos
        </ImageCount>
      </Box>

      <ContentWrapper>
        {/* Header Section */}
        <Box sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <HomeIcon sx={{ color: '#17A5AA', fontSize: '1.2rem' }} />
            <Typography variant="h6" sx={{ color: '#17A5AA', fontWeight: 600 }}>
              {flat.streetName} {flat.streetNumber}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon sx={{ color: '#666', fontSize: '1rem' }} />
            <Typography variant="body2" color="text.secondary">
              {flat.city}
            </Typography>
          </Stack>
        </Box>

        {/* Info Chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <InfoChip
            icon={<SquareFootIcon />}
            label={`${flat.areaSize}m²`}
            size="small"
          />
          <InfoChip
            icon={<BusinessIcon />}
            label={`${flat.yearBuilt}`}
            size="small"
          />
          {flat.hasAC && (
            <InfoChip
              icon={<AcUnitIcon />}
              label="A/C"
              size="small"
            />
          )}
          <InfoChip
            icon={<EventAvailableIcon />}
            label={`Disponible ${formatSimpleDate(flat.dateAvailable)}`}
            size="small"
          />
        </Stack>

        {/* Update Info */}
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <UpdateIcon sx={{ color: '#666', fontSize: '0.875rem' }} />
            <Typography variant="caption" color="text.secondary">
              Actualizado: {formatSimpleDate(flat.atUpdated)}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CalendarTodayIcon sx={{ color: '#666', fontSize: '0.875rem' }} />
            <Typography variant="caption" color="text.secondary">
              Publicado: {formatSimpleDate(flat.atCreated)}
            </Typography>
          </Stack>
        </Stack>

        {/* Price and Actions Section */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#17A5AA' }}>
                {formatPrice(flat.rentPrice)}
                <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                  /mes
                </Typography>
              </Typography>
            </Box>
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