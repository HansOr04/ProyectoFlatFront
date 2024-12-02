import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Apartment as ApartmentIcon
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
              disabled={disabled}
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
          {!disabled && (
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
    </Box>
  );
};
const ProfileUpdate = () => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    profileImage: '',
    flatsOwned: []
  });

  // Estado de edición actualizado para cada campo
  const [editStates, setEditStates] = useState({
    nombre: false,
    apellido: false,
    email: false,
    'fecha de nacimiento': false
  });

  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      if (!userId) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const userData = response.data.data;
        // Asegurarse de que los datos se formateen correctamente
        setProfile({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
          profileImage: userData.profileImage || '',
          flatsOwned: userData.flatsOwned || []
        });

        // Resetear estados de edición
        setEditStates({
          nombre: false,
          apellido: false,
          email: false,
          'fecha de nacimiento': false
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
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
      if (!userId) {
        setSnackbar({
          open: true,
          message: 'Error de autenticación',
          severity: 'error'
        });
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      const updateData = {};
      
      const fieldMapping = {
        'nombre': 'firstName',
        'apellido': 'lastName',
        'email': 'email',
        'fecha de nacimiento': 'birthDate'
      };

      const apiField = fieldMapping[field.toLowerCase()] || field;
      updateData[apiField] = value;

      const response = await axios.put(
        `http://localhost:8080/users/${userId}`, // Cambio aquí
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const updatedData = response.data.data;
        setProfile(prev => ({ 
          ...prev, 
          [apiField]: updatedData[apiField]
        }));
        
        setEditStates(prev => ({ 
          ...prev, 
          [field.toLowerCase()]: false 
        }));
        
        setSnackbar({
          open: true,
          message: 'Perfil actualizado exitosamente',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al actualizar el perfil',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
};

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'La imagen no debe superar los 5MB',
          severity: 'error'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Solo se permiten archivos de imagen',
          severity: 'error'
        });
        return;
      }

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('profileImage', file);
        const token = localStorage.getItem('token');
        
        const response = await axios.put(
          `http://localhost:8080/users/${userId}`, // Cambio aquí
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
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Error al actualizar la imagen',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://localhost:8080/users/profile',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        setSnackbar({
          open: true,
          message: 'Cuenta eliminada exitosamente',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al eliminar la cuenta',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteDialog(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/auth/change-password',
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
      setSnackbar({
        open: true,
        message: 'Contraseña actualizada exitosamente',
        severity: 'success'
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al cambiar la contraseña',
        severity: 'error'
      });
    }
  };
  if (loading && !profile.firstName) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: 'rgb(23, 165, 170)' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <input
                accept="image/*"
                type="file"
                id="profile-image-upload"
                hidden
                onChange={handleImageUpload}
              />
              <label htmlFor="profile-image-upload">
                <ProfileAvatar
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  component="span"
                >
                  {!profile.profileImage && profile.firstName && profile.lastName 
                    ? `${profile.firstName[0]}${profile.lastName[0]}`
                    : null}
                </ProfileAvatar>
              </label>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#0E3F33' }}>
                {`${profile.firstName} ${profile.lastName}`}
              </Typography>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1, 
                bgcolor: 'rgba(31, 209, 215, 0.1)', 
                px: 2, 
                py: 1, 
                borderRadius: 2 
              }}>
                <ApartmentIcon sx={{ color: 'rgb(23, 165, 170)' }} />
                <Typography>
                  {profile.flatsOwned?.length || 0} {profile.flatsOwned?.length === 1 ? 'Propiedad' : 'Propiedades'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <ProfileField
              icon={PersonIcon}
              label="nombre"
              value={profile.firstName}
              isEditing={editStates.nombre}
              onEdit={(value) => setProfile(prev => ({ ...prev, firstName: value }))}
              onSave={() => handleUpdate('nombre', profile.firstName)}
              onCancel={() => setEditStates(prev => ({ ...prev, nombre: false }))}
              setEditStates={setEditStates}
            />

            <ProfileField
              icon={PersonIcon}
              label="apellido"
              value={profile.lastName}
              isEditing={editStates.apellido}
              onEdit={(value) => setProfile(prev => ({ ...prev, lastName: value }))}
              onSave={() => handleUpdate('apellido', profile.lastName)}
              onCancel={() => setEditStates(prev => ({ ...prev, apellido: false }))}
              setEditStates={setEditStates}
            />

            <ProfileField
              icon={EmailIcon}
              label="email"
              value={profile.email}
              type="email"
              isEditing={editStates.email}
              onEdit={(value) => setProfile(prev => ({ ...prev, email: value }))}
              onSave={() => handleUpdate('email', profile.email)}
              onCancel={() => setEditStates(prev => ({ ...prev, email: false }))}
              setEditStates={setEditStates}
            />

            <ProfileField
              icon={CakeIcon}
              label="fecha de nacimiento"
              value={profile.birthDate}
              type="date"
              isEditing={editStates['fecha de nacimiento']}
              onEdit={(value) => setProfile(prev => ({ ...prev, birthDate: value }))}
              onSave={() => handleUpdate('fecha de nacimiento', profile.birthDate)}
              onCancel={() => setEditStates(prev => ({ ...prev, 'fecha de nacimiento': false }))}
              setEditStates={setEditStates}
            />

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
          </StyledPaper>

          {profile.flatsOwned?.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0E3F33' }}>
                Mis Propiedades
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

        <Grid item xs={12} md={4}>
          <InfoCard elevation={1}>
            <InfoIcon className="info-icon" />
            <Typography variant="h6" gutterBottom sx={{ color: '#0E3F33' }}>
              ¿Por qué no aparece mi información aquí?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ocultamos algunos datos de la cuenta para proteger tu identidad.
            </Typography>
          </InfoCard>

          <InfoCard elevation={1}>
            <LockIcon className="info-icon" />
            <Typography variant="h6" gutterBottom sx={{ color: '#0E3F33' }}>
              ¿Qué datos se pueden editar?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los datos personales y de contacto pueden editarse. Si usamos esta información
              para verificar tu identidad, tendrás que volver a verificarla.
            </Typography>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Diálogos y Snackbar */}
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
            ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
            Se eliminarán todas tus propiedades y datos asociados.
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