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
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  areaRange,
  setAreaRange,
  selectedAmenities,
  setSelectedAmenities,
  availableFrom,
  setAvailableFrom,
  ratingFilter,
  setRatingFilter,
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

  // Grupos de amenities organizados
  const AMENITIES_GROUPS = {
    'Básicas': [
      { key: 'wifi', label: 'WiFi' },
      { key: 'tv', label: 'TV' },
      { key: 'kitchen', label: 'Cocina' },
      { key: 'washer', label: 'Lavadora' },
      { key: 'airConditioning', label: 'Aire acondicionado' },
      { key: 'heating', label: 'Calefacción' },
      { key: 'workspace', label: 'Área de trabajo' }
    ],
    'Instalaciones': [
      { key: 'pool', label: 'Piscina' },
      { key: 'gym', label: 'Gimnasio' },
      { key: 'elevator', label: 'Ascensor' },
      { key: 'parking', label: 'Estacionamiento' }
    ],
    'Seguridad': [
      { key: 'smokeAlarm', label: 'Alarma de humo' },
      { key: 'firstAidKit', label: 'Botiquín' },
      { key: 'fireExtinguisher', label: 'Extintor' },
      { key: 'securityCameras', label: 'Cámaras de seguridad' }
    ],
    'Extras': [
      { key: 'petsAllowed', label: 'Mascotas permitidas' }
    ]
  };

  const [expandedSection, setExpandedSection] = React.useState('Básicas');

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
            <MenuItem value="all">Todas las ciudades</MenuItem>
            {uniqueCities.map(city => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Rating */}
        <Box>
          <Typography gutterBottom>Calificación mínima</Typography>
          <Rating
            value={ratingFilter}
            onChange={(_, newValue) => setRatingFilter(newValue)}
            precision={0.5}
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#17A5AA',
              },
              '& .MuiRating-iconHover': {
                color: '#148f94',
              },
            }}
          />
        </Box>

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
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Habitaciones y Baños */}
        <FormControl fullWidth size="small">
          <InputLabel>Dormitorios</InputLabel>
          <Select
            value={bedroomsFilter}
            onChange={(e) => setBedroomsFilter(e.target.value)}
            label="Dormitorios"
          >
            <MenuItem value="all">Todos</MenuItem>
            {BEDROOMS_RANGE.map(num => (
              <MenuItem key={num} value={num}>
                {num} dormitorio{num !== 1 ? 's' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Baños</InputLabel>
          <Select
            value={bathroomsFilter}
            onChange={(e) => setBathroomsFilter(e.target.value)}
            label="Baños"
          >
            <MenuItem value="all">Todos</MenuItem>
            {BATHROOMS_RANGE.map(num => (
              <MenuItem key={num} value={num}>
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

        {/* Amenities agrupados en acordeones */}
        <Box>
          <Typography gutterBottom sx={{ mb: 2 }}>Amenities</Typography>
          {Object.entries(AMENITIES_GROUPS).map(([groupName, amenities]) => (
            <Accordion 
              key={groupName}
              expanded={expandedSection === groupName}
              onChange={() => setExpandedSection(expandedSection === groupName ? false : groupName)}
              sx={{ 
                '&:before': { display: 'none' },
                boxShadow: 'none',
                backgroundColor: 'transparent'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  padding: '0px',
                  '& .MuiAccordionSummary-content': { margin: '4px 0' }
                }}
              >
                <Typography variant="subtitle2">{groupName}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '0px 16px 8px' }}>
                {amenities.map((amenity) => (
                  <FormControlLabel
                    key={amenity.key}
                    control={
                      <Checkbox 
                        checked={selectedAmenities.includes(amenity.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity.key]);
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity.key));
                          }
                        }}
                        sx={{ 
                          '&.Mui-checked': { color: "#17A5AA" },
                          padding: '4px'
                        }}
                      />
                    }
                    label={<Typography variant="body2">{amenity.label}</Typography>}
                    sx={{ marginLeft: 0 }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
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