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

// Función auxiliar para los headers de autenticación
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

// Componente de botón con estado de carga
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

// Componente Dialog para mensajes
const MessageDialog = ({ open, onClose, messages, submitting, toggleMessageVisibility }) => {
    const [filter, setFilter] = useState('visible');
    const visibleMessages = messages.filter(msg => !msg.isHidden);
    const hiddenMessages = messages.filter(msg => msg.isHidden);

    return (
        <Dialog 
            open={open} 
            onClose={() => !submitting && onClose()}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Gestionar Mensajes</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <Button
                        variant={filter === 'visible' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('visible')}
                        sx={{ mr: 1 }}
                    >
                        Mensajes Visibles ({visibleMessages.length})
                    </Button>
                    <Button
                        variant={filter === 'hidden' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('hidden')}
                        color="secondary"
                    >
                        Mensajes Ocultos ({hiddenMessages.length})
                    </Button>
                </Box>

                <Stack spacing={2}>
                    {(filter === 'visible' ? visibleMessages : hiddenMessages).map((message) => (
                        <Paper 
                            key={message._id} 
                            elevation={1} 
                            sx={{ 
                                p: 2,
                                bgcolor: filter === 'hidden' ? 'grey.100' : 'white'
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {message.author.firstName} {message.author.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(message.atCreated).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                                <Tooltip title={message.isHidden ? "Mostrar mensaje" : "Ocultar mensaje"}>
                                    <IconButton 
                                        onClick={() => toggleMessageVisibility(message._id)}
                                        size="small"
                                        disabled={submitting}
                                    >
                                        {message.isHidden ? 
                                            <VisibilityOffIcon color="action" /> : 
                                            <VisibilityIcon color="primary" />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="body1">{message.content}</Typography>
                            {message.rating && (
                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                    <StarIcon sx={{ color: 'gold' }} />
                                    <Typography>{message.rating.overall} / 5</Typography>
                                </Box>
                            )}
                        </Paper>
                    ))}
                    {(filter === 'visible' ? visibleMessages : hiddenMessages).length === 0 && (
                        <Alert severity="info">
                            No hay mensajes {filter === 'visible' ? 'visibles' : 'ocultos'}
                        </Alert>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

const MyFlats = () => {
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

    // Efecto para limpiar las URLs de previsualización
    useEffect(() => {
        return () => {
            selectedImages.forEach(img => {
                if (img.isPreview) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [selectedImages]);

    // Cargar apartamentos al montar el componente
    useEffect(() => {
        fetchMyApartments();
    }, []);

    const fetchMyApartments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }
    
            const userResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/profile`, {
                headers: getAuthHeaders()
            });
    
            if (!userResponse.data.success) {
                throw new Error('No se pudo obtener la información del usuario');
            }
    
            const userId = userResponse.data.data._id;
    
            const flatsResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/flats`, {
                headers: getAuthHeaders(),
                params: {
                    owner: 'true',
                    userId: userId
                }
            });
    
            if (flatsResponse.data.success) {
                const userFlats = flatsResponse.data.data.filter(flat => flat.owner._id === userId);
                setApartments(userFlats);
            } else {
                throw new Error('No se pudieron cargar los departamentos');
            }
    
        } catch (error) {
            setError(error.response?.data?.message || 'Error al cargar tus departamentos');
            console.error('Error detallado:', error);
        } finally {
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
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/flats/${selectedFlat}`, {
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
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/flat/${flatId}`, {
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
                `${import.meta.env.VITE_APP_API_URL}/messages/${messageId}/visibility`,
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
        setUploadFiles([]);
        setOpenImagesDialog(true);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setUploadFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => ({
            _id: URL.createObjectURL(file),
            url: URL.createObjectURL(file),
            file: file,
            isMainImage: false,
            isPreview: true
        }));

        setSelectedImages(prev => [...prev, ...newPreviews]);
    };

    const handleSetMainImage = async (imageId) => {
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('mainImageId', imageId);
    
            console.log('Iniciando cambio de imagen principal:', {
                newMainImageId: imageId,
                currentMainImageId: mainImageId,
                currentImages: selectedImages.map(img => ({
                    id: img._id,
                    isMain: img.isMainImage
                }))
            });
    
            const response = await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/flats/${selectedFlat}/images`,
                formData,
                {
                    headers: getAuthHeaders(true)
                }
            );
    
            if (response.data.success) {
                console.log('Respuesta del servidor:', response.data);
    
                // Actualizar el mainImageId local
                setMainImageId(imageId);
                
                // Actualizar las imágenes seleccionadas asegurando que solo una sea principal
                const updatedSelectedImages = selectedImages.map(img => ({
                    ...img,
                    isMainImage: (img._id === imageId || img.id === imageId)
                }));
                setSelectedImages(updatedSelectedImages);
    
                // Actualizar el estado global de apartamentos
                setApartments(prev => prev.map(apt => {
                    if (apt._id === selectedFlat) {
                        // Asegurarse de que las imágenes del servidor se actualicen correctamente
                        const updatedImages = response.data.data.images.map(img => ({
                            ...img,
                            _id: img.id || img._id,
                            isMainImage: (img.id === imageId || img._id === imageId)
                        }));
    
                        return {
                            ...apt,
                            images: updatedImages
                        };
                    }
                    return apt;
                }));
    
                setError(null);
    
                // Log de verificación del estado final
                console.log('Estado final de imágenes:', {
                    newMainId: imageId,
                    updatedImages: updatedSelectedImages.map(img => ({
                        id: img._id,
                        isMain: img.isMainImage
                    }))
                });
            }
        } catch (error) {
            console.error('Error al establecer imagen principal:', error);
            setError(error.response?.data?.message || 'Error al establecer la imagen principal');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (selectedImages.length <= 1) {
            setError('Debe mantener al menos una imagen');
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('deleteImages', JSON.stringify([imageId]));

            if (imageId === mainImageId) {
                const nextImage = selectedImages.find(img => img._id !== imageId);
                if (nextImage) {
                    formData.append('mainImageId', nextImage._id);
                }
            }

            const response = await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/flats/${selectedFlat}/images`,
                formData,
                {
                    headers: getAuthHeaders(true)
                }
            );

            if (response.data.success) {
                setSelectedImages(prev => {
                    const newImages = prev.filter(img => img._id !== imageId);
                    if (imageId === mainImageId && newImages.length > 0) {
                        const newMainId = response.data.data.images.find(img => img.isMainImage)._id;
                        setMainImageId(newMainId);
                        return newImages.map(img => ({
                            ...img,
                            isMainImage: img._id === newMainId
                        }));
                    }
                    return newImages;
                });

                setApartments(prev => prev.map(apt => {
                    if (apt._id === selectedFlat) {
                        return {
                            ...apt,
                            images: response.data.data.images
                        };
                    }
                    return apt;
                }));

                setError(null);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            setError(error.response?.data?.message || 'Error al eliminar la imagen');
        } finally {
            setSubmitting(false);
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
                `${import.meta.env.VITE_APP_API_URL}/flats/${selectedFlat}/images`,
                formData,
                {
                    headers: getAuthHeaders(true)
                }
            );

            if (response.data.success) {
                setApartments(prev => prev.map(apt => {
                    if (apt._id === selectedFlat) {
                        return {
                            ...apt,
                            images: response.data.data.images
                        };
                    }
                    return apt;
                }));

                selectedImages.forEach(img => {
                    if (img.isPreview) {
                        URL.revokeObjectURL(img.url);
                    }
                });

                setOpenImagesDialog(false);
                setUploadFiles([]);
                setError(null);
            }
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
            <MessageDialog 
                open={openMessagesDialog}
                onClose={() => setOpenMessagesDialog(false)}
                messages={messages}
                submitting={submitting}
                toggleMessageVisibility={toggleMessageVisibility}
            />

            {/* Modal de Imágenes */}
            <Dialog 
                open={openImagesDialog} 
                onClose={() => {
                    if (!submitting) {
                        selectedImages.forEach(img => {
                            if (img.isPreview) {
                                URL.revokeObjectURL(img.url);
                            }
                        });
                        setOpenImagesDialog(false);
                        setUploadFiles([]);
                    }
                }}
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

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <ImageList cols={3} gap={8}>
                        {selectedImages.map((image) => (
                            <ImageListItem key={image._id || image.id} sx={{ position: 'relative' }}>
                                <img
                                    src={image.url}
                                    alt={image.description || 'Imagen del departamento'}
                                    loading="lazy"
                                    style={{
                                        border: (image._id === mainImageId || image.id === mainImageId) ? '3px solid #17A5AA' : 'none',
                                        height: '200px',
                                        width: '100%',
                                        objectFit: 'cover'
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
                                            onClick={() => handleSetMainImage(image._id || image.id)}
                                            disabled={submitting || image.isPreview}
                                        >
                                            {(image._id === mainImageId || image.id === mainImageId) ? (
                                                <StarIcon sx={{ color: '#17A5AA' }} />
                                            ) : (
                                                <StarBorderIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar imagen">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteImage(image._id || image.id)}
                                            disabled={submitting}
                                        >
                                            <DeleteIcon sx={{ color: 'error.main' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                {(image._id === mainImageId || image.id === mainImageId) && (
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
                        onClick={() => {
                            selectedImages.forEach(img => {
                                if (img.isPreview) {
                                    URL.revokeObjectURL(img.url);
                                }
                            });
                            setOpenImagesDialog(false);
                            setUploadFiles([]);
                        }}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleSaveImages}
                        loading={submitting}
                        variant="contained"
                        color="primary"
                        sx={{
                            bgcolor: 'rgb(23, 165, 170)',
                            '&:hover': {
                                bgcolor: 'rgb(18, 140, 145)'
                            }
                        }}
                    >
                        Guardar Cambios
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyFlats;
            