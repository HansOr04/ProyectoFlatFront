import React, { useState, useEffect } from "react";
import { 
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

import axios from 'axios';
import FiltersSidebar from '../components/filters/FiltersSidebar.jsx';
import PropertyCard from '../components/common/PropertyCard.jsx';

const AllFlats = () => {
  // Estados básicos
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("none");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [bedroomsFilter, setBedroomsFilter] = useState("all");
  const [bathroomsFilter, setBathroomsFilter] = useState("all");
  const [hasAcFilter, setHasAcFilter] = useState(false);
  const [areaRange, setAreaRange] = useState([0, 200]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [availableFrom, setAvailableFrom] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);

  // Lista de amenities disponibles
  const availableAmenities = [
    "Gimnasio",
    "Piscina",
    "Seguridad 24/7",
    "Parqueadero",
    "Área social",
    "Vista al río",
    "Terraza",
    "Jardín",
    "Bodega"
  ];

  // Token de autenticación
  const token = localStorage.getItem('token');

  // Función para obtener los departamentos
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/flats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setFlats(response.data.data);
          
          // Establecer rangos iniciales basados en los datos
          const prices = response.data.data.map(flat => flat.rentPrice);
          const areas = response.data.data.map(flat => flat.areaSize);
          
          if (prices.length > 0) {
            setPriceRange([Math.min(...prices), Math.max(...prices)]);
          }
          
          if (areas.length > 0) {
            setAreaRange([Math.min(...areas), Math.max(...areas)]);
          }
        }
        
        setError(null);
      } catch (err) {
        setError('Error al cargar los departamentos. Por favor, intente más tarde.');
        console.error('Error fetching flats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, [token]);

  // Efecto para cargar favoritos si el usuario está autenticado
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:8080/users/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setFavorites(response.data.data.map(flat => flat._id));
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchFavorites();
  }, [token]);

  // Función para filtrar los departamentos
  const filteredAndSortedFlats = flats.filter(flat => {
    // Filtro de búsqueda
    const matchesSearch = flat.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       flat.streetName?.toLowerCase().includes(searchTerm.toLowerCase());
                      
    // Filtro de ciudad
    const matchesCity = cityFilter === "all" || flat.city === cityFilter;
    
    // Filtro de precio
    const matchesPrice = flat.rentPrice >= priceRange[0] && flat.rentPrice <= priceRange[1];
    
    // Filtro de habitaciones
    const matchesBedrooms = bedroomsFilter === "all" || flat.bedrooms === parseInt(bedroomsFilter);
    
    // Filtro de baños
    const matchesBathrooms = bathroomsFilter === "all" || flat.bathrooms === parseInt(bathroomsFilter);
    
    // Filtro de aire acondicionado
    const matchesAc = !hasAcFilter || flat.hasAC;
    
    // Filtro de área
    const matchesArea = flat.areaSize >= areaRange[0] && flat.areaSize <= areaRange[1];
    
    // Filtro de amenities
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => flat.amenities?.includes(amenity));
    
    // Filtro de fecha disponible
    const matchesDate = !availableFrom || new Date(flat.dateAvailable) <= new Date(availableFrom);
    
    // Filtro de rating
    const matchesRating = !ratingFilter || (flat.rating || 0) >= ratingFilter;

    return matchesSearch && matchesCity && matchesPrice && matchesBedrooms && 
           matchesBathrooms && matchesAc && matchesArea && matchesAmenities && 
           matchesDate && matchesRating;
  }).sort((a, b) => {
    if (priceSort === "asc") return a.rentPrice - b.rentPrice;
    if (priceSort === "desc") return b.rentPrice - a.rentPrice;
    return 0;
  });

  // Manejar favoritos
  const handleToggleFavorite = async (id) => {
    if (!token) {
      setError('Debe iniciar sesión para agregar favoritos');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/flats/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setFavorites(prev => 
          prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
        );
      }
    } catch (err) {
      setError('Error al actualizar favoritos. Por favor, intente más tarde.');
      console.error('Error toggling favorite:', err);
    }
  };

  // Función para resetear filtros
  const resetFilters = () => {
    setSearchTerm("");
    setCityFilter("all");
    setPriceSort("none");
    setPriceRange([0, 2000]);
    setBedroomsFilter("all");
    setBathroomsFilter("all");
    setHasAcFilter(false);
    setAreaRange([0, 200]);
    setSelectedAmenities([]);
    setAvailableFrom("");
    setRatingFilter(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: "#1a1a1a", mb: 4 }}>
        Departamentos Disponibles
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 4 }}>
        <FiltersSidebar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          priceSort={priceSort}
          setPriceSort={setPriceSort}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          bedroomsFilter={bedroomsFilter}
          setBedroomsFilter={setBedroomsFilter}
          bathroomsFilter={bathroomsFilter}
          setBathroomsFilter={setBathroomsFilter}
          hasAcFilter={hasAcFilter}
          setHasAcFilter={setHasAcFilter}
          areaRange={areaRange}
          setAreaRange={setAreaRange}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
          availableFrom={availableFrom}
          setAvailableFrom={setAvailableFrom}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          availableAmenities={availableAmenities}
          flats={flats}
          resetFilters={resetFilters}
        />

        <Box sx={{ flex: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {filteredAndSortedFlats.map((flat) => (
                  <PropertyCard 
                    key={flat._id} 
                    flat={flat}
                    isFavorite={favorites.includes(flat._id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </Box>

              {filteredAndSortedFlats.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No se encontraron departamentos que coincidan con tu búsqueda
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AllFlats;