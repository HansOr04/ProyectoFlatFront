import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Button,
  Typography,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Paper,
  Switch,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled("div")`
  padding: 32px;
  max-width: 1400px;
  margin: auto;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const StyledHeader = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledGridContainer = styled(Paper)`
  height: 700px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .MuiDataGrid-root {
    border: none;
  }

  .MuiDataGrid-columnHeaders {
    background-color: rgba(23, 165, 170, 0.1);
    color: #0E3F33;
  }

  .MuiDataGrid-cell {
    border-bottom: 1px solid rgba(23, 165, 170, 0.1);
  }

  .MuiDataGrid-row:hover {
    background-color: rgba(31, 209, 215, 0.05);
  }
`;

const StyledButton = styled(Button)`
  margin: 0 4px;
  &.view-button {
    color: rgb(23, 165, 170);
    border-color: rgb(23, 165, 170);
    &:hover {
      background-color: rgba(23, 165, 170, 0.1);
      border-color: rgb(23, 165, 170);
    }
  }
  &.delete-button {
    color: #d32f2f;
    border-color: #d32f2f;
    &:hover {
      background-color: rgba(211, 47, 47, 0.1);
      border-color: #d32f2f;
    }
  }
`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const formattedUsers = response.data.data.map((user) => ({
        ...user,
        id: user._id,
        flatsCount: user.flatsOwned?.length || 0,
        createdAt: new Date(user.atCreated).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        birthDate: user.birthDate ? new Date(user.birthDate).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'No especificado'
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error al cargar usuarios",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSnackbar({
        open: true,
        message: "Usuario eliminado exitosamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error al eliminar usuario",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/users/${id}`,
        { isAdmin: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, isAdmin: !currentStatus } : user
          )
        );
        setSnackbar({
          open: true,
          message: `Usuario ${!currentStatus ? "promovido a" : "removido de"} administrador`,
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error al cambiar rol",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "profileImage",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Avatar 
          src={params.row.profileImage}
          sx={{ bgcolor: 'rgb(23, 165, 170)' }}
        >
          {params.row.firstName?.[0] || ''}
        </Avatar>
      ),
    },
    { 
      field: "email", 
      headerName: "Email", 
      flex: 1,
      minWidth: 200
    },
    { 
      field: "firstName", 
      headerName: "Nombre", 
      width: 130
    },
    { 
      field: "lastName", 
      headerName: "Apellido", 
      width: 130
    },
    {
      field: "birthDate",
      headerName: "Fecha de Nacimiento",
      width: 200,
    },
    {
      field: "flatsCount",
      headerName: "Propiedades",
      width: 100,
      align: 'center'
    },
    {
      field: "createdAt",
      headerName: "Fecha de Registro",
      width: 200,
    },
    {
      field: "isAdmin",
      headerName: "Admin",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.row.isAdmin}
          onChange={() => handleToggleAdmin(params.row.id, params.row.isAdmin)}
          icon={<UserIcon />}
          checkedIcon={<AdminIcon />}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: 'rgb(23, 165, 170)',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'rgb(23, 165, 170)',
            }
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StyledButton
            className="view-button"
            variant="outlined"
            size="small"
            onClick={() => navigate(`/users/${params.row.id}`)}
          >
            <ViewIcon />
          </StyledButton>
          <StyledButton
            className="delete-button"
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedUser(params.row);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon />
          </StyledButton>
        </Box>
      ),
    },
  ];

  return (
    <StyledContainer>
      <StyledHeader>
        <Typography variant="h4" sx={{ color: '#0E3F33', fontWeight: 500 }}>
          Panel de Administración
        </Typography>
      </StyledHeader>

      <StyledGridContainer>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: CircularProgress,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 }
            }
          }}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          autoHeight
        />
      </StyledGridContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ color: '#0E3F33' }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.firstName} {selectedUser?.lastName}?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#0E3F33' }}>
            Cancelar
          </Button>
          <Button
            onClick={() => handleDeleteUser(selectedUser?.id)}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default AdminPanel;