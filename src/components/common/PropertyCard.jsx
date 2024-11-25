// components/PropertyCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';

const PropertyCard = ({ flat, isFavorite, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return price.toLocaleString('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' }, 
      maxHeight: { md: 250 },
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      <CardMedia
        component="img"
        sx={{ 
          width: { xs: '100%', md: 350 },
          height: { xs: 200, md: '100%' },
          objectFit: 'cover'
        }}
        image={flat.images?.[0]?.url || 'https://via.placeholder.com/350x250'}
        alt={`Propiedad en ${flat.city}`}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
        <CardContent sx={{ flex: '1 0 auto', position: 'relative', p: 0 }}>
          {/* Botón de favorito */}
          <IconButton 
            onClick={() => onToggleFavorite(flat._id)}
            sx={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              '&:hover': { 
                bgcolor: 'rgba(255, 0, 0, 0.1)' 
              }
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: 'red' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>

          {/* Precio y fecha de creación */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#17A5AA' }}>
              {formatPrice(flat.rentPrice)}/mes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Publicado el {formatDate(flat.atCreated)}
            </Typography>
          </Box>

          {/* Ubicación */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              {flat.streetName} {flat.streetNumber}, {flat.city}
            </Typography>
          </Box>

          {/* Características principales */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Tooltip title="Área">
              <Chip
                icon={<SquareFootIcon />}
                label={`${flat.areaSize} m²`}
                variant="outlined"
                size="small"
              />
            </Tooltip>
            
            <Tooltip title="Año de construcción">
              <Chip
                icon={<BusinessIcon />}
                label={`Construido ${flat.yearBuilt}`}
                variant="outlined"
                size="small"
              />
            </Tooltip>
            
            {flat.hasAC && (
              <Tooltip title="Aire acondicionado">
                <Chip
                  icon={<AcUnitIcon />}
                  label="A/C"
                  variant="outlined"
                  size="small"
                />
              </Tooltip>
            )}
            
            <Tooltip title="Disponible desde">
              <Chip
                icon={<CalendarTodayIcon />}
                label={formatDate(flat.dateAvailable)}
                variant="outlined"
                size="small"
              />
            </Tooltip>
          </Box>

          {/* Fecha de última actualización */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Última actualización: {formatDate(flat.atUpdated)}
          </Typography>

          {/* Botón de acción */}
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#17A5AA',
              '&:hover': { 
                bgcolor: '#148f94',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Ver detalles
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PropertyCard;