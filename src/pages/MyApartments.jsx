import React, { useState, useEffect } from 'react';
import PropertyCard from "../components/common/PropertyCard";
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Container, 
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ImageList,
    ImageListItem,
    IconButton,
    TextField
} from '@mui/material';
import {
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Star as StarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyApartments = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Estados para los modales
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [openImagesDialog, setOpenImagesDialog] = useState(false);
    const [openMessagesDialog, setOpenMessagesDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);

    useEffect(() => {
        fetchMyApartments();
    }, []);

    const fetchMyApartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/flats', {
                headers: { Authorization: `Bearer ${token}` },
                params: { owner: true }
            });
            setApartments(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching apartments:', error);
            setError('Error al cargar los departamentos');
            setLoading(false);
        }
    };

    const handleEdit = (flatId) => {
        navigate(`/apartments/edit/${flatId}`);
    };

    // Modal de eliminación
    const handleDelete = (flatId) => {
        setSelectedFlat(flatId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/flats/${selectedFlat}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApartments(apartments.filter(apt => apt._id !== selectedFlat));
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting apartment:', error);
            setError('Error al eliminar el departamento');
        }
    };

    // Modal de gestión de mensajes
    const handleManageMessages = async (flatId) => {
        setSelectedFlat(flatId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/messages/flat/${flatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.data);
            setOpenMessagesDialog(true);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Error al cargar los mensajes');
        }
    };

    const toggleMessageVisibility = async (messageId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:8080/messages/${messageId}/visibility`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(messages.map(msg => 
                msg._id === messageId ? { ...msg, isHidden: !msg.isHidden } : msg
            ));
        } catch (error) {
            console.error('Error toggling message visibility:', error);
            setError('Error al actualizar la visibilidad del mensaje');
        }
    };

    // Modal de gestión de imágenes
    const handleManageImages = async (flatId) => {
        setSelectedFlat(flatId);
        const flat = apartments.find(apt => apt._id === flatId);
        setSelectedImages(flat.images || []);
        setOpenImagesDialog(true);
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        setUploadFiles(files);
    };

    const submitImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            uploadFiles.forEach(file => {
                formData.append('images', file);
            });

            await axios.put(
                `http://localhost:8080/flats/${selectedFlat}/images`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Actualizar la lista de apartamentos
            fetchMyApartments();
            setOpenImagesDialog(false);
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Error al subir las imágenes');
        }
    };

    const handleViewDetails = (flatId) => {
        navigate(`/apartments/${flatId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Mis Departamentos
            </Typography>
            
            {apartments.length === 0 ? (
                <Alert severity="info">
                    No tienes departamentos publicados aún.
                </Alert>
            ) : (
                <Box display="flex" flexDirection="column" gap={3}>
                    {apartments.map((apartment) => (
                        <PropertyCard
                            key={apartment._id}
                            flat={apartment}
                            isOwnerView={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onManageMessages={handleManageMessages}
                            onManageImages={handleManageImages}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </Box>
            )}

            {/* Modal de Eliminación */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    ¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Gestión de Mensajes */}
            <Dialog 
                open={openMessagesDialog} 
                onClose={() => setOpenMessagesDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Gestionar Mensajes</DialogTitle>
                <DialogContent>
                    {messages.map((message) => (
                        <Box key={message._id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2">
                                    {message.author.firstName} {message.author.lastName}
                                </Typography>
                                <IconButton 
                                    onClick={() => toggleMessageVisibility(message._id)}
                                    size="small"
                                >
                                    {message.isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {message.content}
                            </Typography>
                            {message.rating && (
                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                    <StarIcon sx={{ color: 'gold' }} />
                                    <Typography variant="body2">
                                        {message.rating.overall}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMessagesDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Gestión de Imágenes */}
            <Dialog 
                open={openImagesDialog} 
                onClose={() => setOpenImagesDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Gestionar Imágenes</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="raised-button-file">
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                            >
                                Subir Imágenes
                            </Button>
                        </label>
                    </Box>
                    <ImageList cols={3} gap={8}>
                        {selectedImages.map((image) => (
                            <ImageListItem key={image._id}>
                                <img
                                    src={image.url}
                                    alt={image.description || 'Imagen del departamento'}
                                    loading="lazy"
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        backgroundColor: 'white'
                                    }}
                                    onClick={() => {
                                        setSelectedImages(selectedImages.filter(img => img._id !== image._id));
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImagesDialog(false)}>Cancelar</Button>
                    <Button onClick={submitImages} variant="contained" color="primary">
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyApartments;