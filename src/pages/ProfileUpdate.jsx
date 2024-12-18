import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
  Upload as UploadIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  AdminPanelSettings
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledPaper = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ProfileAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledButton = styled(Button)`
  text-transform: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: 500;
  color: #0E3F33;
  &.MuiButton-outlined {
    border-color: #0E3F33;
    &:hover {
      background-color: rgba(31, 209, 215, 0.1);
      border-color: #1FD1D7;
    }
  }
`;

const InfoCard = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  
  .info-icon {
    margin-bottom: 1rem;
    color: rgb(23, 165, 170);
    font-size: 2rem;
  }
`;

const PropertyCard = styled(Paper)`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;
// Función de formateo
const formatValue = (value, type) => {
  if (value === null || value === undefined) return 'No proporcionado';
  
  if (type === 'date') {
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return String(value);
};

// Funciones de validación
const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Debe tener al menos 2 caracteres";
  }
  if (name.trim().length > 50) {
    return "No puede exceder los 50 caracteres";
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    return "Solo puede contener letras y espacios";
  }
  return null;
};

const validateEmail = (email) => {
  if (!email) {
    return "El email es requerido";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Formato de email inválido";
  }
  return null;
};

const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return "La fecha de nacimiento es requerida";
  }

  const birthDateObj = new Date(birthDate);
  const today = new Date();
  
  if (isNaN(birthDateObj.getTime())) {
    return "Fecha inválida";
  }

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  if (age < 18) {
    return "Debes tener al menos 18 años";
  }

  if (age > 120) {
    return "La edad no puede ser mayor a 120 años";
  }

  if (birthDateObj > today) {
    return "La fecha no puede ser futura";
  }

  return null;
};
const ProfileField = ({ 
  icon: IconComponent, 
  label, 
  value, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  type = 'text',
  error,
  disabled = false,
  setEditStates
}) => {
  const handleEdit = () => {
    setEditStates(prev => ({
      ...prev,
      [label.toLowerCase()]: true
    }));
  };

  const userInfo = JSON.parse(localStorage.getItem('user'));
  const isAdmin = userInfo?.isAdmin;
  const isEmailField = label.toLowerCase() === 'email';

  // Si es campo de email y no es admin, no se puede editar
  const canEdit = !disabled && (!isEmailField || isAdmin);

  return (
    <Box sx={{ 
      mb: 3, 
      p: 2, 
      borderRadius: 2, 
      bgcolor: isEditing ? 'rgba(31, 209, 215, 0.04)' : 'transparent',
      transition: 'background-color 0.3s ease'
    }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <IconComponent sx={{ color: 'rgb(23, 165, 170)' }} />
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {label}
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              type={type}
              value={value || ''}
              onChange={(e) => onEdit(e.target.value)}
              error={!!error}
              helperText={error}
              variant="outlined"
              disabled={!canEdit}
              InputLabelProps={type === 'date' ? { shrink: true } : undefined}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'rgb(23, 165, 170)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(23, 165, 170)',
                  }
                }
              }}
            />
          ) : (
            <Typography color="text.primary" sx={{ fontSize: '1rem' }}>
              {formatValue(value, type)}
            </Typography>
          )}
        </Grid>
        <Grid item>
          {canEdit && (
            isEditing ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={onSave} 
                  sx={{ 
                    color: 'rgb(23, 165, 170)',
                    '&:hover': {
                      backgroundColor: 'rgba(31, 209, 215, 0.1)'
                    }
                  }}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={onCancel}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light'
                    }
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton 
                size="small" 
                onClick={handleEdit}
                sx={{ 
                  color: '#0E3F33',
                  '&:hover': {
                    backgroundColor: 'rgba(31, 209, 215, 0.1)'
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            )
          )}
        </Grid>
      </Grid>
      {isEmailField && !isAdmin && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ display: 'block', mt: 1 }}
        >
          Solo los administradores pueden modificar el correo electrónico
        </Typography>
      )}
    </Box>
  );
};
const ProfileUpdate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const loggedUserId = JSON.parse(localStorage.getItem('user'))?.id;
  const isOwnProfile = !params.id || params.id === loggedUserId;
  const targetUserId = params.id || loggedUserId;

  // Estado del perfil
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    profileImage: '',
    flatsOwned: [],
    isAdmin: false
  });

  // Estados de edición para cada campo
  const [editStates, setEditStates] = useState({
    nombre: false,
    apellido: false,
    email: false,
    'fecha de nacimiento': false
  });

  // Estado de errores
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estados para controles de UI
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  
  // Estado para el manejo de contraseñas
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Efecto para cargar el perfil inicial
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('user'));
    setCanEdit(isOwnProfile || userInfo?.isAdmin);
    fetchUserProfile();
  }, [navigate, isOwnProfile]);
  const fetchUserProfile = async () => {
    try {
      if (!targetUserId) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/users/${targetUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const userData = response.data.data;
        setProfile({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
          profileImage: userData.profileImage || '',
          flatsOwned: userData.flatsOwned || [],
          isAdmin: userData.isAdmin || false
        });

        setEditStates({
          nombre: false,
          apellido: false,
          email: false,
          'fecha de nacimiento': false
        });
      }
    } catch (err) {
      console.error('Error en fetchUserProfile:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
        return;
      }
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al cargar el perfil',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field, value) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !targetUserId) {
        setSnackbar({
          open: true,
          message: 'Error de autenticación',
          severity: 'error'
        });
        return;
      }

      const userInfo = JSON.parse(localStorage.getItem('user'));
      const isAdmin = userInfo?.isAdmin;
      const isEmailUpdate = field.toLowerCase() === 'email';

      // Debug info
      console.log('Update attempt:', {
        field,
        value,
        targetUserId,
        isAdmin,
        userInfo
      });

      if (isEmailUpdate && !isAdmin) {
        setSnackbar({
          open: true,
          message: 'No tienes permisos para actualizar el email',
          severity: 'error'
        });
        setEditStates(prev => ({ ...prev, email: false }));
        return;
      }

      const fieldMapping = {
        'nombre': 'firstName',
        'apellido': 'lastName',
        'email': 'email',
        'fecha de nacimiento': 'birthDate'
      };

      const apiField = fieldMapping[field.toLowerCase()];
      if (!apiField) {
        console.error('Campo no válido:', field);
        throw new Error(`Campo no válido: ${field}`);
      }

      // Validación del valor
      let validationError = null;
      const trimmedValue = value.trim();

      switch (apiField) {
        case 'firstName':
        case 'lastName':
          validationError = validateName(trimmedValue);
          break;
        case 'email':
          validationError = validateEmail(trimmedValue);
          break;
        case 'birthDate':
          validationError = validateBirthDate(trimmedValue);
          break;
      }

      if (validationError) {
        setErrors(prev => ({ ...prev, [apiField]: validationError }));
        return;
      }

      setLoading(true);

      const updateData = {
        [apiField]: trimmedValue
      };

      console.log('Enviando actualización:', {
        endpoint: `${import.meta.env.VITE_APP_API_URL}/users/${targetUserId}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: updateData
      });

      const response = await axios({
        method: 'PUT',
        url: `${import.meta.env.VITE_APP_API_URL}/users/${targetUserId}`,
        data: updateData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response);

      if (response.data.success) {
        setProfile(prev => ({ ...prev, [apiField]: response.data.data[apiField] }));
        setEditStates(prev => ({ ...prev, [field.toLowerCase()]: false }));
        setErrors(prev => ({ ...prev, [apiField]: '' }));
        
        setSnackbar({
          open: true,
          message: 'Perfil actualizado exitosamente',
          severity: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response data:', err.response?.data);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Error al actualizar el perfil';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      
      setEditStates(prev => ({ ...prev, [field.toLowerCase()]: false }));
    } finally {
      setLoading(false);
    }
};
  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
  
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Solo se permiten imágenes en formato JPEG, PNG o WEBP',
          severity: 'error'
        });
        return;
      }
  
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSnackbar({
          open: true,
          message: 'La imagen no debe superar los 5MB',
          severity: 'error'
        });
        return;
      }
  
      setLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);
  
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/users/${targetUserId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          profileImage: response.data.data.profileImage
        }));
  
        setSnackbar({
          open: true,
          message: 'Imagen actualizada exitosamente',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error en handleImageUpload:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al actualizar la imagen',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validar los campos de contraseña
    const passwordErrors = {
      currentPassword: !passwordData.currentPassword ? "La contraseña actual es requerida" : "",
      newPassword: !passwordData.newPassword ? "La nueva contraseña es requerida" : "",
      confirmPassword: !passwordData.confirmPassword ? "Confirma la nueva contraseña" : ""
    };

    if (passwordData.newPassword) {
      const minLength = 8;
      const maxLength = 20;
      const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
      const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
      const hasNumbers = /\d/.test(passwordData.newPassword);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordData.newPassword);

      if (passwordData.newPassword.length < minLength) {
        passwordErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
      } else if (passwordData.newPassword.length > maxLength) {
        passwordErrors.newPassword = "La contraseña no puede exceder los 20 caracteres";
      } else if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        let errorMsg = "La contraseña debe contener al menos:";
        if (!hasUpperCase) errorMsg += " una mayúscula,";
        if (!hasLowerCase) errorMsg += " una minúscula,";
        if (!hasNumbers) errorMsg += " un número,";
        if (!hasSpecialChar) errorMsg += " un carácter especial,";
        passwordErrors.newPassword = errorMsg.slice(0, -1) + ".";
      }
    }
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      passwordErrors.confirmPassword = "Las contraseñas no coinciden";
    }
  
    const hasErrors = Object.values(passwordErrors).some(error => error !== "");
    if (hasErrors) {
      setErrors(prev => ({ ...prev, ...passwordErrors }));
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      setPasswordDialog(false);
      setErrors({});
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSnackbar({
        open: true,
        message: 'Contraseña actualizada exitosamente',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error en handlePasswordChange:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al cambiar la contraseña',
        severity: 'error'
      });
    }
  };
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Validar que exista el token
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      // Validar que exista el ID del usuario
      if (!targetUserId) {
        throw new Error('No se encontró el ID del usuario');
      }
  
      console.log('Iniciando eliminación de cuenta:', {
        userId: targetUserId,
        isOwnProfile,
        endpoint: `${import.meta.env.VITE_APP_API_URL}/users/${targetUserId}`
      });
  
      // Realizar la petición de eliminación
      const response = await axios({
        method: 'DELETE',
        url: `${import.meta.env.VITE_APP_API_URL}/users/${targetUserId}`,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Agregar un timeout para evitar esperas indefinidas
        timeout: 30000 // 30 segundos
      });
  
      console.log('Respuesta del servidor:', response.data);
  
      if (response.data.success) {
        // Si es el propio perfil, limpiar el almacenamiento local
        if (isOwnProfile) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
  
        // Cerrar el diálogo antes de navegar
        setDeleteDialog(false);
  
        // Mostrar notificación de éxito
        setSnackbar({
          open: true,
          message: 'Cuenta eliminada exitosamente',
          severity: 'success'
        });
  
        // Navegar después de un breve delay para permitir que se muestre la notificación
        setTimeout(() => {
          navigate(isOwnProfile ? '/login' : '/admin');
        }, 1000);
      } else {
        throw new Error(response.data.message || 'Error al eliminar la cuenta');
      }
    } catch (err) {
      console.error('Error completo en handleDeleteAccount:', err);
      
      // Determinar el mensaje de error apropiado
      let errorMessage = 'Error al eliminar la cuenta';
      
      if (err.response) {
        // Error de respuesta del servidor
        console.error('Datos de error del servidor:', err.response.data);
        errorMessage = err.response.data.message || err.response.data.error || 'Error del servidor al eliminar la cuenta';
      } else if (err.request) {
        // Error de red
        console.error('Error de red:', err.request);
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet';
      } else {
        // Otros errores
        console.error('Error:', err.message);
        errorMessage = err.message || 'Error desconocido al eliminar la cuenta';
      }
  
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      // Asegurarse de que loading y el diálogo se cierren
      setLoading(false);
      setDeleteDialog(false);
    }
  };

  // Loading state render
  if (loading && !profile.firstName) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: 'rgb(23, 165, 170)' }} />
      </Box>
    );
  }

  // Main component render
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {canEdit && (
                <input
                  accept="image/*"
                  type="file"
                  id="profile-image-upload"
                  hidden
                  onChange={handleImageUpload}
                />
              )}
              <Box 
                sx={{ 
                  position: 'relative',
                  display: 'inline-block',
                  mb: 2,
                  '&:hover .upload-overlay': {
                    opacity: 1
                  }
                }}
              >
                <label htmlFor={canEdit ? "profile-image-upload" : undefined}>
                  <ProfileAvatar
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    sx={{ 
                      width: 120,
                      height: 120,
                      cursor: canEdit ? 'pointer' : 'default',
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: canEdit ? 'scale(1.05)' : 'none'
                      }
                    }}
                  >
                    {!profile.profileImage && (
                      profile.firstName && profile.lastName 
                        ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
                        : <PersonIcon sx={{ fontSize: 60, color: 'rgb(23, 165, 170)' }} />
                    )}
                  </ProfileAvatar>
                  {canEdit && (
                    <Box
                      className="upload-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <UploadIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                  )}
                </label>
              </Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: '#0E3F33',
                  mb: 2 
                }}
              >
                {`${profile.firstName} ${profile.lastName}`}
              </Typography>
              
              {/* Badges de usuario */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                mb: 1
              }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: 'rgba(23, 165, 170, 0.1)', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(23, 165, 170, 0.2)'
                  }
                }}>
                  <ApartmentIcon sx={{ color: 'rgb(23, 165, 170)' }} />
                  <Typography sx={{ color: '#0E3F33' }}>
                    {profile.flatsOwned?.length || 0} {profile.flatsOwned?.length === 1 ? 'Propiedad' : 'Propiedades'}
                  </Typography>
                </Box>
  
                {profile.isAdmin && (
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: 'rgba(23, 165, 170, 0.1)',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(23, 165, 170, 0.2)'
                    }
                  }}>
                    <AdminPanelSettings sx={{ color: 'rgb(23, 165, 170)' }} />
                    <Typography sx={{ color: '#0E3F33' }}>Administrador</Typography>
                  </Box>
                )}
              </Box>
            </Box>
  
            <Divider sx={{ my: 3 }} />
            
            {/* Campos del perfil */}
            <ProfileField
              icon={PersonIcon}
              label="nombre"
              value={profile.firstName}
              isEditing={editStates.nombre}
              onEdit={(value) => setProfile(prev => ({ ...prev, firstName: value }))}
              onSave={() => handleUpdate('nombre', profile.firstName)}
              onCancel={() => {
                setEditStates(prev => ({ ...prev, nombre: false }));
                setErrors(prev => ({ ...prev, firstName: '' }));
              }}
              error={errors.firstName}
              setEditStates={setEditStates}
              disabled={!canEdit}
            />
  
            <ProfileField
              icon={PersonIcon}
              label="apellido"
              value={profile.lastName}
              isEditing={editStates.apellido}
              onEdit={(value) => setProfile(prev => ({ ...prev, lastName: value }))}
              onSave={() => handleUpdate('apellido', profile.lastName)}
              onCancel={() => {
                setEditStates(prev => ({ ...prev, apellido: false }));
                setErrors(prev => ({ ...prev, lastName: '' }));
              }}
              error={errors.lastName}
              setEditStates={setEditStates}
              disabled={!canEdit}
            />
  
            <ProfileField
              icon={EmailIcon}
              label="email"
              value={profile.email}
              type="email"
              isEditing={editStates.email}
              onEdit={(value) => setProfile(prev => ({ ...prev, email: value }))}
              onSave={() => handleUpdate('email', profile.email)}
              onCancel={() => {
                setEditStates(prev => ({ ...prev, email: false }));
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              setEditStates={setEditStates}
              disabled={!canEdit}
            />
  
            <ProfileField
              icon={CakeIcon}
              label="fecha de nacimiento"
              value={profile.birthDate}
              type="date"
              isEditing={editStates['fecha de nacimiento']}
              onEdit={(value) => setProfile(prev => ({ ...prev, birthDate: value }))}
              onSave={() => handleUpdate('fecha de nacimiento', profile.birthDate)}
              onCancel={() => {
                setEditStates(prev => ({ ...prev, 'fecha de nacimiento': false }));
                setErrors(prev => ({ ...prev, birthDate: '' }));
              }}
              error={errors.birthDate}
              setEditStates={setEditStates}
              disabled={!canEdit}
            />
  
            {/* Botones de cambiar contraseña y eliminar cuenta */}
            {canEdit && isOwnProfile && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <StyledButton
                  startIcon={<KeyIcon />}
                  onClick={() => setPasswordDialog(true)}
                  variant="outlined"
                  sx={{ 
                    color: 'rgb(23, 165, 170)', 
                    borderColor: 'rgb(23, 165, 170)',
                    '&:hover': {
                      borderColor: '#1FD1D7',
                      backgroundColor: 'rgba(31, 209, 215, 0.1)'
                    }
                  }}
                >
                  Cambiar contraseña
                </StyledButton>
                
                <StyledButton
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialog(true)}
                  variant="outlined"
                  color="error"
                >
                  Eliminar cuenta
                </StyledButton>
              </Box>
            )}
          </StyledPaper>

          {/* Lista de propiedades */}
          {profile.flatsOwned?.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0E3F33' }}>
                {isOwnProfile ? 'Mis Propiedades' : 'Propiedades'}
              </Typography>
              {profile.flatsOwned.map((flat) => (
                <PropertyCard key={flat._id} elevation={0}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <HomeIcon sx={{ color: 'rgb(23, 165, 170)', fontSize: 40 }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1" fontWeight="500" color="#0E3F33">
                        {flat.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {flat.city}, {flat.streetName} {flat.streetNumber}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => navigate(`/flats/${flat._id}`)}
                        sx={{ 
                          color: 'rgb(23, 165, 170)', 
                          borderColor: 'rgb(23, 165, 170)',
                          '&:hover': {
                            borderColor: '#1FD1D7',
                            backgroundColor: 'rgba(31, 209, 215, 0.1)'
                          }
                        }}
                      >
                        Ver detalles
                      </Button>
                    </Grid>
                  </Grid>
                </PropertyCard>
              ))}
            </Box>
          )}
        </Grid>

        {/* Tarjetas de información */}
        <Grid item xs={12} md={4}>
          <InfoCard elevation={1}>
            <InfoIcon className="info-icon" />
            <Typography variant="h6" gutterBottom sx={{ color: '#0E3F33' }}>
              ¿Por qué no puedo actualizar mi correo electrónico?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              El correo electrónico esta atado a los departamentos, por lo cual, modificar esta información podría causar conflictos
            </Typography>
          </InfoCard>

          <InfoCard elevation={1}>
            <LockIcon className="info-icon" />
            <Typography variant="h6" gutterBottom sx={{ color: '#0E3F33' }}>
              ¿Qué datos se pueden editar?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los datos personales como nombre, apellido y fecha de nacimiento pueden editarse. La contraseña también se puede actualizar siempre y cuando se ingrese la contraseña actual.
            </Typography>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Diálogos */}
      <Dialog 
        open={deleteDialog} 
        onClose={() => setDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ color: '#0E3F33' }}>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar {isOwnProfile ? 'tu cuenta' : 'esta cuenta'}? 
            Esta acción no se puede deshacer.
            {isOwnProfile && ' Se eliminarán todas tus propiedades y datos asociados.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog(false)}
            sx={{ color: '#0E3F33' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de cambio de contraseña */}
      <Dialog 
        open={passwordDialog} 
        onClose={() => setPasswordDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ color: '#0E3F33' }}>Cambiar contraseña</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Contraseña actual"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              currentPassword: e.target.value
            }))}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(23, 165, 170)',
                }
              }
            }}
          />
          <TextField
            margin="dense"
            label="Nueva contraseña"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              newPassword: e.target.value
            }))}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(23, 165, 170)',
                }
              }
            }}
          />
          <TextField
            margin="dense"
            label="Confirmar nueva contraseña"
            type="password"
            fullWidth
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(23, 165, 170)',
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPasswordDialog(false)}
            sx={{ color: '#0E3F33' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handlePasswordChange}
            variant="contained"
            sx={{ 
              bgcolor: 'rgb(23, 165, 170)',
              '&:hover': {
                bgcolor: '#1FD1D7'
              }
            }}
          >
            Cambiar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileUpdate;