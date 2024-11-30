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
    Tooltip,
    Paper,
    Stack
} from '@mui/material';
import {
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`
    };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

const LoadingButton = ({ loading, children, ...props }) => (
    <Button disabled={loading} {...props}>
        {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Cargando...
            </Box>
        ) : children}
    </Button>
);

const MyApartments = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // Estados para los modales
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [openImagesDialog, setOpenImagesDialog] = useState(false);
    const [openMessagesDialog, setOpenMessagesDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [mainImageId, setMainImageId] = useState(null);

    useEffect(() => {
        fetchMyApartments();
    }, []);

    const fetchMyApartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/flats', {
                headers: getAuthHeaders(),
                params: { owner: true }
            });
            setApartments(response.data.data);
            setError(null);
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

    const handleDelete = (flatId) => {
        setSelectedFlat(flatId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setSubmitting(true);
        try {
            await axios.delete(`http://localhost:8080/flats/${selectedFlat}`, {
                headers: getAuthHeaders()
            });
            setApartments(apartments.filter(apt => apt._id !== selectedFlat));
            setOpenDeleteDialog(false);
            setError(null);
        } catch (error) {
            console.error('Error deleting apartment:', error);
            setError('Error al eliminar el departamento');
        } finally {
            setSubmitting(false);
        }
    };

    const handleManageMessages = async (flatId) => {
        setSelectedFlat(flatId);
        try {
            const response = await axios.get(`http://localhost:8080/messages/flat/${flatId}`, {
                headers: getAuthHeaders()
            });
            setMessages(response.data.data);
            setOpenMessagesDialog(true);
            setError(null);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Error al cargar los mensajes');
        }
    };

    const toggleMessageVisibility = async (messageId) => {
        setSubmitting(true);
        try {
            await axios.patch(
                `http://localhost:8080/messages/${messageId}/visibility`,
                {},
                { headers: getAuthHeaders() }
            );
            setMessages(messages.map(msg => 
                msg._id === messageId ? { ...msg, isHidden: !msg.isHidden } : msg
            ));
            setError(null);
        } catch (error) {
            console.error('Error toggling message visibility:', error);
            setError('Error al actualizar la visibilidad del mensaje');
        } finally {
            setSubmitting(false);
        }
    };

    const handleManageImages = async (flatId) => {
        const flat = apartments.find(apt => apt._id === flatId);
        setSelectedFlat(flatId);
        setSelectedImages(flat.images || []);
        setMainImageId(flat.images.find(img => img.isMainImage)?._id || null);
        setOpenImagesDialog(true);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setUploadFiles(prev => [...prev, ...files]);
    };

    const handleSetMainImage = (imageId) => {
        setMainImageId(imageId);
        setSelectedImages(prev => 
            prev.map(img => ({
                ...img,
                isMainImage: img._id === imageId
            }))
        );
    };

    const handleDeleteImage = async (imageId) => {
        if (selectedImages.length <= 1) {
            setError('Debe mantener al menos una imagen');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('deleteImages', JSON.stringify([imageId]));

            await axios.put(
                `http://localhost:8080/flats/${selectedFlat}/images`,
                formData,
                {
                    headers: getAuthHeaders(true)
                }
            );

            setSelectedImages(prev => {
                const newImages = prev.filter(img => img._id !== imageId);
                if (imageId === mainImageId && newImages.length > 0) {
                    handleSetMainImage(newImages[0]._id);
                }
                return newImages;
            });
            setError(null);
        } catch (error) {
            console.error('Error deleting image:', error);
            setError(error.response?.data?.message || 'Error al eliminar la imagen');
        }
    };

    const handleSaveImages = async () => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            
            uploadFiles.forEach(file => {
                formData.append('images', file);
            });

            if (mainImageId) {
                formData.append('mainImageId', mainImageId);
            }

            const response = await axios.put(
                `http://localhost:8080/flats/${selectedFlat}/images`,
                formData,
                {
                    headers: getAuthHeaders(true)
                }
            );

            await fetchMyApartments();
            setOpenImagesDialog(false);
            setUploadFiles([]);
            setError(null);
        } catch (error) {
            console.error('Error saving images:', error);
            setError(error.response?.data?.message || 'Error al guardar las imágenes');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewDetails = (flatId) => {
        navigate(`/flats/${flatId}`);
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
            <Dialog 
                open={openDeleteDialog} 
                onClose={() => !submitting && setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDeleteDialog(false)} 
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton 
                        onClick={confirmDelete} 
                        loading={submitting}
                        color="error"
                        variant="contained"
                    >
                        Eliminar
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Modal de Mensajes */}
            <Dialog 
                open={openMessagesDialog} 
                onClose={() => !submitting && setOpenMessagesDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Gestionar Mensajes</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        {messages.map((message) => (
                            <Paper key={message._id} elevation={1} sx={{ p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {message.author.firstName} {message.author.lastName}
                                    </Typography>
                                    <Tooltip title={message.isHidden ? "Mostrar mensaje" : "Ocultar mensaje"}>
                                        <IconButton 
                                            onClick={() => toggleMessageVisibility(message._id)}
                                            size="small"
                                            disabled={submitting}
                                        >
                                            {message.isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Typography 
                                    variant="body1" 
                                    sx={{ opacity: message.isHidden ? 0.6 : 1 }}
                                >
                                    {message.content}
                                </Typography>
                                {message.rating && (
                                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                                        <StarIcon sx={{ color: 'gold' }} />
                                        <Typography>
                                            {message.rating.overall}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMessagesDialog(false)}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Imágenes */}
            <Dialog 
                open={openImagesDialog} 
                onClose={() => !submitting && setOpenImagesDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Gestionar Imágenes</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
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
                                disabled={submitting}
                            >
                                Subir Imágenes
                            </Button>
                        </label>
                        {uploadFiles.length > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                {uploadFiles.length} archivo(s) seleccionado(s)
                            </Typography>
                        )}
                    </Box>
                    <ImageList cols={3} gap={8}>
                        {selectedImages.map((image) => (
                            <ImageListItem key={image._id} sx={{ position: 'relative' }}>
                                <img
                                    src={image.url}
                                    alt={image.description || 'Imagen del departamento'}
                                    loading="lazy"
                                    style={{
                                        border: image._id === mainImageId ? '3px solid #17A5AA' : 'none',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        display: 'flex',
                                        gap: 1,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        borderRadius: 1,
                                        p: 0.5
                                    }}
                                >
                                    <Tooltip title="Establecer como principal">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleSetMainImage(image._id)}
                                            disabled={submitting}
                                        >
                                            {image._id === mainImageId ? (
                                                <StarIcon sx={{ color: '#17A5AA' }} />
                                            ) : (
                                                <StarBorderIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar imagen">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteImage(image._id)}
                                            disabled={submitting}
                                        >
                                            <DeleteIcon sx={{ color: 'error.main' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                {image._id === mainImageId && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'rgba(23, 165, 170, 0.8)',
                                            color: 'white',
                                            p: 0.5,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Imagen Principal
                                    </Box>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenImagesDialog(false)}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleSaveImages}
                        loading={submitting}
                        variant="contained"
                        color="primary"
                    >
                        Guardar Cambios
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyApartments;