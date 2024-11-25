import React from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
  Rating,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const FiltersSidebar = ({
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  priceSort,
  setPriceSort,
  priceRange,
  setPriceRange,
  bedroomsFilter,
  setBedroomsFilter,
  bathroomsFilter,
  setBathroomsFilter,
  hasAcFilter,
  setHasAcFilter,
  areaRange,
  setAreaRange,
  selectedAmenities,
  setSelectedAmenities,
  availableFrom,
  setAvailableFrom,
  ratingFilter,
  setRatingFilter,
  availableAmenities,
  flats,
  resetFilters
}) => {
  // Obtener ciudades únicas y ordenadas
  const uniqueCities = React.useMemo(() => {
    return Array.from(new Set(flats.map(flat => flat.city)))
      .filter(Boolean)
      .sort();
  }, [flats]);

  // Constantes para los rangos
  const BEDROOMS_RANGE = [1, 2, 3, 4, 5];
  const BATHROOMS_RANGE = [1, 2, 3, 4];
  const SORT_OPTIONS = [
    { value: 'none', label: 'Sin ordenar' },
    { value: 'asc', label: 'Menor a mayor' },
    { value: 'desc', label: 'Mayor a menor' }
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: 280,
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        position: 'sticky',
        top: 20,
        height: 'fit-content',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 40px)'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#1a1a1a", mb: 3 }}>
        Filtros
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar por ciudad o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        
        <Divider />

        {/* Ciudad */}
        <FormControl fullWidth size="small">
          <InputLabel>Ciudad</InputLabel>
          <Select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            label="Ciudad"
          >
            <MenuItem key="all-cities" value="all">Todas las ciudades</MenuItem>
            {uniqueCities.map(city => (
              <MenuItem key={`city-${city}`} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Rango de precio */}
        <Box>
          <Typography gutterBottom>Rango de precio</Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
            sx={{ color: "#17A5AA" }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">${priceRange[0].toLocaleString()}</Typography>
            <Typography variant="body2">${priceRange[1].toLocaleString()}</Typography>
          </Box>
        </Box>

        {/* Ordenar por precio */}
        <FormControl fullWidth size="small">
          <InputLabel>Ordenar por precio</InputLabel>
          <Select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            label="Ordenar por precio"
          >
            {SORT_OPTIONS.map(option => (
              <MenuItem key={`sort-${option.value}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Habitaciones */}
        <FormControl fullWidth size="small">
          <InputLabel>Dormitorios</InputLabel>
          <Select
            value={bedroomsFilter}
            onChange={(e) => setBedroomsFilter(e.target.value)}
            label="Dormitorios"
          >
            <MenuItem key="all-bedrooms" value="all">Todos</MenuItem>
            {BEDROOMS_RANGE.map(num => (
              <MenuItem key={`bedrooms-${num}`} value={num}>
                {num} dormitorio{num !== 1 ? 's' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Baños */}
        <FormControl fullWidth size="small">
          <InputLabel>Baños</InputLabel>
          <Select
            value={bathroomsFilter}
            onChange={(e) => setBathroomsFilter(e.target.value)}
            label="Baños"
          >
            <MenuItem key="all-bathrooms" value="all">Todos</MenuItem>
            {BATHROOMS_RANGE.map(num => (
              <MenuItem key={`bathrooms-${num}`} value={num}>
                {num} baño{num !== 1 ? 's' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Área */}
        <Box>
          <Typography gutterBottom>Área (m²)</Typography>
          <Slider
            value={areaRange}
            onChange={(_, newValue) => setAreaRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={200}
            sx={{ color: "#17A5AA" }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">{areaRange[0]} m²</Typography>
            <Typography variant="body2">{areaRange[1]} m²</Typography>
          </Box>
        </Box>

        <Divider />

        {/* Características adicionales */}
        <Box>
          <Typography gutterBottom>Características</Typography>
          <FormControlLabel
            control={
              <Checkbox 
                checked={hasAcFilter}
                onChange={(e) => setHasAcFilter(e.target.checked)}
                sx={{ '&.Mui-checked': { color: "#17A5AA" } }}
              />
            }
            label="Aire acondicionado"
          />
        </Box>

        <Divider />

        {/* Rating mínimo */}
        <Box>
          <Typography gutterBottom>Rating mínimo</Typography>
          <Rating
            value={ratingFilter}
            onChange={(_, newValue) => setRatingFilter(newValue)}
            precision={0.5}
          />
        </Box>

        <Divider />

        {/* Amenities */}
        <Box>
          <Typography gutterBottom>Amenities</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {availableAmenities.map((amenity) => (
              <FormControlLabel
                key={`amenity-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                control={
                  <Checkbox 
                    checked={selectedAmenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      } else {
                        setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                      }
                    }}
                    sx={{ '&.Mui-checked': { color: "#17A5AA" } }}
                  />
                }
                label={amenity}
              />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Fecha disponible */}
        <TextField
          fullWidth
          label="Disponible desde"
          type="date"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
        />

        {/* Botón para resetear filtros */}
        <Button
          variant="outlined"
          fullWidth
          onClick={resetFilters}
          sx={{
            borderColor: "#17A5AA",
            color: "#17A5AA",
            "&:hover": {
              borderColor: "#148f94",
              backgroundColor: "rgba(23, 165, 170, 0.1)",
            },
          }}
        >
          Limpiar filtros
        </Button>
      </Box>
    </Paper>
  );
};

export default FiltersSidebar;