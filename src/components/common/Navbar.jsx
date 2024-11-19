import React, { useState } from 'react';
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

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  flexShrink: 0,
  position: 'static',
  '& .MuiToolbar-root': {
    minHeight: '64px',
  }
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
});

const LogoText = styled(Typography)({
  color: '#0E3F33',
  fontWeight: 700,
  fontFamily: 'Roboto',
  fontSize: '1.5rem',
});

const NavButton = styled(Button)({
  color: '#0E3F33',
  margin: '0 8px',
  fontFamily: 'Roboto',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#1FD1D7',
    color: 'white',
  },
});

const AuthButton = styled(Button)(({ variant }) => ({
  fontFamily: 'Roboto',
  fontWeight: 500,
  padding: '6px 16px',
  ...(variant === 'contained' && {
    backgroundColor: '#1FD1D7',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0E3F33',
    },
  }),
  ...(variant === 'outlined' && {
    color: '#0E3F33',
    borderColor: '#0E3F33',
    '&:hover': {
      backgroundColor: 'rgba(31, 209, 215, 0.1)',
      borderColor: '#1FD1D7',
    },
  }),
}));

const NavMenuItem = styled(MenuItem)({
  color: '#0E3F33',
  fontFamily: 'Roboto',
  '&:hover': {
    backgroundColor: '#1FD1D7',
    color: 'white',
  },
});

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const pages = ['Inicio', 'Apartamentos', 'Favoritos'];
  const settings = ['Profile', 'Admin Panel', 'My Apartments', 'Logout'];
  
  // Simulated auth check - replace with your actual JWT validation
  const isAuthenticated = localStorage.getItem('token') !== null;

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

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <LogoContainer
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
                <NavMenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </NavMenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <LogoContainer
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
                key={page}
                onClick={handleCloseNavMenu}
              >
                {page}
              </NavButton>
            ))}
          </Box>

          {/* Auth Section */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: '#1FD1D7' }}>IS</Avatar>
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
                    <NavMenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </NavMenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={2}>
                <AuthButton variant="outlined">
                  Sign Up
                </AuthButton>
                <AuthButton variant="contained">
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