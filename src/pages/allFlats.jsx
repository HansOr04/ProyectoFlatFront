import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import FiltersSidebar from "../components/filters/FiltersSidebar.jsx";
import PropertyCard from "../components/common/PropertyCard.jsx";

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

  // Estado para el drawer de filtros
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lista actualizada de amenities disponibles
  const availableAmenities = [
    { key: "wifi", label: "WiFi" },
    { key: "tv", label: "TV" },
    { key: "kitchen", label: "Cocina" },
    { key: "washer", label: "Lavadora" },
    { key: "airConditioning", label: "Aire acondicionado" },
    { key: "heating", label: "Calefacción" },
    { key: "workspace", label: "Área de trabajo" },
    { key: "pool", label: "Piscina" },
    { key: "gym", label: "Gimnasio" },
    { key: "elevator", label: "Ascensor" },
    { key: "parking", label: "Estacionamiento" },
    { key: "petsAllowed", label: "Mascotas permitidas" },
    { key: "smokeAlarm", label: "Alarma de humo" },
    { key: "firstAidKit", label: "Botiquín" },
    { key: "fireExtinguisher", label: "Extintor" },
    { key: "securityCameras", label: "Cámaras de seguridad" },
  ];

  // Token de autenticación
  const token = localStorage.getItem("token");

  // Función para obtener los departamentos
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/flats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setFlats(response.data.data);

          // Establecer rangos iniciales basados en los datos
          const prices = response.data.data.map((flat) => flat.rentPrice);
          const areas = response.data.data.map((flat) => flat.areaSize);

          if (prices.length > 0) {
            setPriceRange([Math.min(...prices), Math.max(...prices)]);
          }

          if (areas.length > 0) {
            setAreaRange([Math.min(...areas), Math.max(...areas)]);
          }
        }

        setError(null);
      } catch (err) {
        setError(
          "Error al cargar los departamentos. Por favor, intente más tarde."
        );
        console.error("Error fetching flats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, [token]);

  // Efecto para cargar favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:8080/users/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setFavorites(response.data.data.map((flat) => flat._id));
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [token]);

  // Función para filtrar los departamentos
  const filteredAndSortedFlats = flats
    .filter((flat) => {
      // Filtro de búsqueda
      const matchesSearch =
        flat.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flat.streetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flat.title?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de ciudad
      const matchesCity = cityFilter === "all" || flat.city === cityFilter;

      // Filtro de precio
      const matchesPrice =
        flat.rentPrice >= priceRange[0] && flat.rentPrice <= priceRange[1];

      // Filtro de habitaciones
      const matchesBedrooms =
        bedroomsFilter === "all" || flat.bedrooms === parseInt(bedroomsFilter);

      // Filtro de baños
      const matchesBathrooms =
        bathroomsFilter === "all" ||
        flat.bathrooms === parseInt(bathroomsFilter);

      // Filtro de aire acondicionado
      const matchesAc = !hasAcFilter || flat.amenities?.airConditioning;

      // Filtro de área
      const matchesArea =
        flat.areaSize >= areaRange[0] && flat.areaSize <= areaRange[1];

      // Filtro de amenities
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenityKey) => {
          if (amenityKey === "parking") {
            return flat.amenities?.parking?.available;
          }
          return flat.amenities?.[amenityKey];
        });

      // Filtro de fecha disponible
      const matchesDate =
        !availableFrom ||
        new Date(flat.dateAvailable) <= new Date(availableFrom);

      // Filtro de rating
      const matchesRating =
        !ratingFilter || (flat.ratings?.overall || 0) >= ratingFilter;

      return (
        matchesSearch &&
        matchesCity &&
        matchesPrice &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesAc &&
        matchesArea &&
        matchesAmenities &&
        matchesDate &&
        matchesRating
      );
    })
    .sort((a, b) => {
      if (priceSort === "asc") return a.rentPrice - b.rentPrice;
      if (priceSort === "desc") return b.rentPrice - a.rentPrice;
      return 0;
    });

  // Manejar favoritos
  const handleToggleFavorite = async (id) => {
    if (!token) {
      setError("Debe iniciar sesión para agregar favoritos");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/flats/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFavorites((prev) =>
          prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
        );
      }
    } catch (err) {
      setError("Error al actualizar favoritos. Por favor, intente más tarde.");
      console.error("Error toggling favorite:", err);
    }
  };

  // Función para ver detalles
  const handleViewDetails = (id) => {
    // Implementar navegación a la página de detalles
    window.location.href = `/flats/${id}`;
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E3F33", mb: 4 }}
      >
        Departamentos Disponibles
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <IconButton
          sx={{ display: { md: "none" } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ display: { md: "none" } }}
        >
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
        </Drawer>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
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
        </Box>

        <Box sx={{ flex: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#17A5AA" }} />
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
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </Box>

              {filteredAndSortedFlats.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No se encontraron departamentos que coincidan con tu
                    búsqueda
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
