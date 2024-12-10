import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
  Snackbar,
  Container,
  Drawer,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Fab,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const FavoritesView = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem("favoriteFolders");
    return savedFolders
      ? JSON.parse(savedFolders)
      : {
          "All Favorites": [],
        };
  });
  const [selectedFolder, setSelectedFolder] = useState("All Favorites");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get("/users/favorites");
        setFavorites(response.data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  useEffect(() => {
    localStorage.setItem("favoriteFolders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const handleError = (err) => {
    if (err.response?.status === 401) {
      navigate("/login");
      return;
    }
    setSnackbar({
      open: true,
      message: "Ha ocurrido un error",
      severity: "error",
    });
  };

  const handleRemoveFromFavorites = async (flatId) => {
    try {
      const response = await axiosInstance.post(`/flats/${flatId}/favorite`);
      if (response.data.success) {
        setFavorites((prev) => prev.filter((flat) => flat._id !== flatId));
        // Remove from all folders
        const updatedFolders = { ...folders };
        Object.keys(updatedFolders).forEach((folderName) => {
          updatedFolders[folderName] = updatedFolders[folderName].filter(
            (id) => id !== flatId
          );
        });
        setFolders(updatedFolders);
        showSnackbar("Eliminado de favoritos", "success");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && !folders[newFolderName]) {
      setFolders((prev) => ({
        ...prev,
        [newFolderName]: [],
      }));
      setNewFolderName("");
      setIsAddingFolder(false);
      showSnackbar("Carpeta creada exitosamente", "success");
    }
  };

  const handleDeleteFolder = (folderName, event) => {
    event.stopPropagation();
    if (folderName === "All Favorites") return;
    const newFolders = { ...folders };
    delete newFolders[folderName];
    setFolders(newFolders);
    setSelectedFolder("All Favorites");
    showSnackbar("Carpeta eliminada", "success");
  };

  const handleAddToFolder = (folderName) => {
    if (!selectedProperty || folderName === "All Favorites") return;

    setFolders((prev) => ({
      ...prev,
      [folderName]: [...new Set([...prev[folderName], selectedProperty._id])],
    }));

    setMenuAnchorEl(null);
    setSelectedProperty(null);
    showSnackbar("Añadido a la carpeta", "success");
  };

  const handleRemoveFromFolder = (flatId, folderName) => {
    if (folderName === "All Favorites") return;

    setFolders((prev) => ({
      ...prev,
      [folderName]: prev[folderName].filter((id) => id !== flatId),
    }));

    showSnackbar("Eliminado de la carpeta", "success");
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const Sidebar = () => (
    <Box
      sx={{
        width: isMobile ? "100%" : "auto",
        height: "100%",
        overflow: "auto",
        p: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Mis Carpetas</Typography>
        <IconButton onClick={() => setIsAddingFolder(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      {isAddingFolder && (
        <Box mb={2} display="flex" gap={1}>
          <TextField
            size="small"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nombre de carpeta"
            fullWidth
            autoFocus
          />
          <Button variant="contained" onClick={handleCreateFolder} size="small">
            Crear
          </Button>
        </Box>
      )}

      {Object.keys(folders).map((folderName) => (
        <Box
          key={folderName}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            my: 0.5,
            borderRadius: 1,
            cursor: "pointer",
            bgcolor:
              selectedFolder === folderName ? "action.selected" : "transparent",
            "&:hover": {
              bgcolor:
                selectedFolder === folderName
                  ? "action.selected"
                  : "action.hover",
            },
          }}
          onClick={() => {
            setSelectedFolder(folderName);
            if (isMobile) setDrawerOpen(false);
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <FolderIcon color="action" />
            <Typography>{folderName}</Typography>
          </Box>
          {folderName !== "All Favorites" && (
            <IconButton
              size="small"
              onClick={(e) => handleDeleteFolder(folderName, e)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );

  const PropertyCard = ({ flat }) => {
    const handleCardClick = (e) => {
      if (!e.target.closest("button")) {
        navigate(`/flats/${flat._id}`);
      }
    };

    return (
      <Card
        elevation={2}
        onClick={handleCardClick}
        sx={{
          position: "relative",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={
            flat.images?.find((img) => img.isMainImage)?.url ||
            flat.images?.[0]?.url
          }
          alt={flat.title}
          sx={{
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
            color: "white",
            p: 2,
          }}
        >
          <Typography variant="h6">{flat.city}</Typography>
          <Typography variant="body2">
            {flat.areaSize} m² - ${flat.rentPrice}/mes
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            sx={{
              bgcolor: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.9)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProperty(flat);
              setMenuAnchorEl(e.currentTarget);
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.9)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFromFavorites(flat._id);
            }}
          >
            <FavoriteIcon color="error" />
          </IconButton>
        </Box>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {isMobile ? (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Sidebar />
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <Sidebar />
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${260}px)` },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {selectedFolder}
          </Typography>
        </Box>

        {favorites.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              bgcolor: "background.paper",
              borderRadius: 1,
              mt: 3,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes propiedades favoritas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explora las propiedades disponibles y guarda tus favoritas aquí
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {favorites
              .filter(
                (flat) =>
                  selectedFolder === "All Favorites" ||
                  folders[selectedFolder].includes(flat._id)
              )
              .map((flat) => (
                <PropertyCard key={flat._id} flat={flat} />
              ))}
          </Box>
        )}
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => {
          setMenuAnchorEl(null);
          setSelectedProperty(null);
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Añadir a carpeta</Typography>
        </MenuItem>
        {Object.keys(folders)
          .filter((name) => name !== "All Favorites")
          .map((folderName) => (
            <MenuItem
              key={folderName}
              onClick={() => handleAddToFolder(folderName)}
              selected={folders[folderName].includes(selectedProperty?._id)}
            >
              <FolderIcon sx={{ mr: 1 }} fontSize="small" />
              {folderName}
            </MenuItem>
          ))}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FavoritesView;
