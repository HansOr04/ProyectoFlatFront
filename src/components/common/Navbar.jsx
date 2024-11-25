import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { styled } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  '& .MuiToolbar-root': {
    minHeight: '64px',
  }
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
});

const LogoText = styled(Typography)({
  color: '#0E3F33',
  fontWeight: 700,
  fontFamily: 'Roboto',
  fontSize: '1.5rem',
  letterSpacing: '0.5px'
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#0E3F33',
  margin: '0 8px',
  fontFamily: 'Roboto',
  fontWeight: 500,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: '2px',
    backgroundColor: '#1FD1D7',
    transition: 'width 0.3s ease-in-out',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    '&::after': {
      width: '80%',
    }
  }
}));

const AuthButton = styled(Button)(({ variant }) => ({
  fontFamily: 'Roboto',
  fontWeight: 500,
  padding: '6px 16px',
  borderRadius: '8px',
  transition: 'all 0.3s ease-in-out',
  ...(variant === 'contained' && {
    backgroundColor: '#1FD1D7',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0E3F33',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(31, 209, 215, 0.2)',
    },
  }),
  ...(variant === 'outlined' && {
    color: '#0E3F33',
    borderColor: '#0E3F33',
    '&:hover': {
      backgroundColor: 'rgba(31, 209, 215, 0.1)',
      borderColor: '#1FD1D7',
      transform: 'translateY(-2px)',
    },
  }),
}));

const NavMenuItem = styled(MenuItem)({
  color: '#0E3F33',
  fontFamily: 'Roboto',
  padding: '10px 20px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(31, 209, 215, 0.1)',
    color: '#1FD1D7',
    transform: 'translateX(5px)',
  }
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#1FD1D7',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 8px rgba(31, 209, 215, 0.2)',
  }
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Definir los manejadores de eventos primero
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate('/');
    handleCloseUserMenu();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavigation = (page) => {
    if (page.requireAuth && !isAuthenticated) {
      navigate('/login');
    } else {
      navigate(page.path);
    }
    handleCloseNavMenu();
  };

  const handleSettingClick = (action) => {
    action();
    handleCloseUserMenu();
  };

  // Páginas y settings
  const pages = [
    { name: 'Inicio', path: '/' },
    { name: 'Apartamentos', path: '/allflats', requireAuth: true },
    { name: 'Favoritos', path: '/favorites', requireAuth: true }
  ];

  const [settings, setSettings] = useState([
    { name: 'Profile', action: () => navigate('/profile') },
    { name: 'My Apartments', action: () => navigate('/my-apartments') },
    { name: 'Logout', action: handleLogout }
  ]);

  // useEffect para verificar autenticación
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (token && user) {
        setIsAuthenticated(true);
        setUserInfo(user);
        
        if (user.isAdmin) {
          setSettings([
            { name: 'Profile', action: () => navigate('/profile') },
            { name: 'Admin Panel', action: () => navigate('/admin') },
            { name: 'My Apartments', action: () => navigate('/my-apartments') },
            { name: 'Logout', action: handleLogout }
          ]);
        }
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <LogoContainer
            onClick={handleLogoClick}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <MapsHomeWorkIcon sx={{ color: '#0E3F33', fontSize: 32 }} />
            <LogoText variant="h6" noWrap>
              IdealSpace
            </LogoText>
          </LogoContainer>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#0E3F33' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <NavMenuItem 
                  key={page.name} 
                  onClick={() => handleNavigation(page)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </NavMenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <LogoContainer
            onClick={handleLogoClick}
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'center',
            }}
          >
            <MapsHomeWorkIcon sx={{ color: '#0E3F33', fontSize: 28 }} />
            <LogoText variant="h6" noWrap>
              IdealSpace
            </LogoText>
          </LogoContainer>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <NavButton
                key={page.name}
                onClick={() => handleNavigation(page)}
              >
                {page.name}
              </NavButton>
            ))}
          </Box>

          {/* Auth Section */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <StyledAvatar src={userInfo?.profileImage || null}>
                      {!userInfo?.profileImage && `${userInfo?.firstName?.[0]}${userInfo?.lastName?.[0]}`}
                    </StyledAvatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <NavMenuItem 
                      key={setting.name} 
                      onClick={() => handleSettingClick(setting.action)}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </NavMenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={2}>
                <AuthButton 
                  variant="outlined" 
                  onClick={handleSignUp}
                >
                  Sign Up
                </AuthButton>
                <AuthButton 
                  variant="contained"
                  onClick={handleLogin}
                >
                  Log In
                </AuthButton>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;