import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Upload as UploadIcon
} from '@mui/icons-material';
import styled from '@emotion/styled';

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
`;

const InfoCard = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  
  .info-icon {
    margin-bottom: 1rem;
    color: #1976d2;
    font-size: 2rem;
  }
`;

const ProfileField = ({ 
  icon: IconComponent,
  label, 
  value, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  type = 'text',
  error 
}) => (
  <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: isEditing ? 'rgba(25, 118, 210, 0.04)' : 'transparent' }}>
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <IconComponent color="primary" />
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
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
          />
        ) : (
          <Typography>
            {type === 'date' && value 
              ? new Date(value).toLocaleDateString()
              : value || 'No proporcionado'}
          </Typography>
        )}
      </Grid>
      <Grid item>
        {isEditing ? (
          <Box>
            <IconButton size="small" onClick={onSave} color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton size="small" onClick={onCancel} color="error">
              <CancelIcon />
            </IconButton>
          </Box>
        ) : (
          <IconButton size="small" onClick={() => onEdit(true)} color="primary">
            <EditIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  </Box>
);

export default function ProfileUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    profileImage: ''
  });

  const [editStates, setEditStates] = useState({});
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
  }, [id]);

 // ... continuación del componente anterior

 const fetchUserProfile = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success) {
      setProfile(response.data.data);
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
    setLoading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append(field, value);

    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      setProfile(prev => ({ ...prev, [field]: value }));
      setEditStates(prev => ({ ...prev, [field]: false }));
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
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
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
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success) {
      localStorage.removeItem('token');
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
      `${process.env.REACT_APP_API_URL}/auth/change-password`,
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      },
      {
        headers: { Authorization: `Bearer ${token}` }
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
      <CircularProgress />
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
              />
            </label>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {`${profile.firstName} ${profile.lastName}`}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <ProfileField
            icon={PersonIcon}
            label="Nombre"
            value={profile.firstName}
            isEditing={editStates.firstName}
            onEdit={(value) => {
              setProfile(prev => ({ ...prev, firstName: value }));
              setEditStates(prev => ({ ...prev, firstName: true }));
            }}
            onSave={() => handleUpdate('firstName', profile.firstName)}
            onCancel={() => setEditStates(prev => ({ ...prev, firstName: false }))}
          />

          <ProfileField
            icon={PersonIcon}
            label="Apellido"
            value={profile.lastName}
            isEditing={editStates.lastName}
            onEdit={(value) => {
              setProfile(prev => ({ ...prev, lastName: value }));
              setEditStates(prev => ({ ...prev, lastName: true }));
            }}
            onSave={() => handleUpdate('lastName', profile.lastName)}
            onCancel={() => setEditStates(prev => ({ ...prev, lastName: false }))}
          />

          <ProfileField
            icon={EmailIcon}
            label="Correo electrónico"
            value={profile.email}
            type="email"
            isEditing={editStates.email}
            onEdit={(value) => {
              setProfile(prev => ({ ...prev, email: value }));
              setEditStates(prev => ({ ...prev, email: true }));
            }}
            onSave={() => handleUpdate('email', profile.email)}
            onCancel={() => setEditStates(prev => ({ ...prev, email: false }))}
          />

          <ProfileField
            icon={CakeIcon}
            label="Fecha de nacimiento"
            value={profile.birthDate}
            type="date"
            isEditing={editStates.birthDate}
            onEdit={(value) => {
              setProfile(prev => ({ ...prev, birthDate: value }));
              setEditStates(prev => ({ ...prev, birthDate: true }));
            }}
            onSave={() => handleUpdate('birthDate', profile.birthDate)}
            onCancel={() => setEditStates(prev => ({ ...prev, birthDate: false }))}
          />

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <StyledButton
              startIcon={<KeyIcon />}
              onClick={() => setPasswordDialog(true)}
              variant="outlined"
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
      </Grid>

      <Grid item xs={12} md={4}>
        <InfoCard elevation={1}>
          <InfoIcon className="info-icon" />
          <Typography variant="h6" gutterBottom>
            ¿Por qué no aparece mi información aquí?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ocultamos algunos datos de la cuenta para proteger tu identidad.
          </Typography>
        </InfoCard>

        <InfoCard elevation={1}>
          <LockIcon className="info-icon" />
          <Typography variant="h6" gutterBottom>
            ¿Qué datos se pueden editar?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Los datos personales y de contacto pueden editarse. Si usamos esta información
            para verificar tu identidad, tendrás que volver a verificarla.
          </Typography>
        </InfoCard>
      </Grid>
    </Grid>

    {/* Diálogos */}
    <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
      <DialogTitle>Eliminar cuenta</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialog(false)}>
          Cancelar
        </Button>
        <Button onClick={handleDeleteAccount} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
      <DialogTitle>Cambiar contraseña</DialogTitle>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPasswordDialog(false)}>
          Cancelar
        </Button>
        <Button onClick={handlePasswordChange} color="primary" variant="contained">
          Cambiar
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
    >
      <Alert 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Container>
);
}