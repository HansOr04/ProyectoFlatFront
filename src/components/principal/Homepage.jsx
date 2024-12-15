import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box,
  Container,
  Typography,
  IconButton,
  Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1FD1D7',
      light: '#4CDFE4',
      dark: '#17A5AA',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
});

const SearchButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  width: 60,
  height: 60,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(31, 209, 215, 0.4)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.up('sm')]: {
    width: 70,
    height: 70,
  },
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  fontSize: '2rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.5rem',
  },
}));

const DestinationCard = ({ name, image, onSearch }) => (
  <Card
    sx={{
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease-in-out',
      height: '100%',
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    }}
    onClick={() => onSearch(name)}
  >
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    <Typography
      variant="h6"
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        color: 'white',
        fontWeight: 500,
        fontSize: { xs: '1rem', sm: '1.1rem' },
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      }}
    >
      {name}
    </Typography>
  </Card>
);

const destinations = [
  { name: "Quito", image: "https://images.pexels.com/photos/18309489/pexels-photo-18309489/free-photo-of-ciudad-iglesia-catolico-cristianismo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Guayaquil", image: "https://q-xx.bstatic.com/xdata/images/hotel/max500/415749624.jpg?k=2ec87ac3f1765aedf961419ebb9ea6fe273b65563153396cf7f3c7ad39625607&o=" },
  { name: "Ibarra", image: "https://www.lahora.com.ec/wp-content/uploads/2023/09/IBARRA-PANORAMICA.png" },
  { name: "Ambato", image: "https://cdn.voxlocalis.net/media/cache/9e/c5/9ec5afcd72d1a1ab67f2060767e414a4.jpg" },
  { name: "Cuenca", image: "https://irp.cdn-website.com/23be95e4/dms3rep/multi/Imagen+1-b5e9bd4b.png" },
  { name: "Casa Blanca", image: "https://images.trvl-media.com/lodging/64000000/63890000/63888800/63888726/446b1759.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('city');

  const handleSearch = (city = '') => {
    if (city) {
      navigate(`/allflats?city=${encodeURIComponent(city)}`);
    } else {
      navigate('/allflats');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: '#f5f5f5', 
        minHeight: '100vh',
        p: { xs: 2, sm: 3 }
      }}>
        {/* Hero section */}
        <Box
          sx={{
            height: { xs: 400, sm: 450 },
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backgroundImage: 'url(https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                fontWeight: 300,
                letterSpacing: 0.5,
                mb: 1
              }}
            >
              Book your stay with Tripster
            </Typography>
            
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 300,
                letterSpacing: 0.3,
                opacity: 0.9,
                mb: 3
              }}
            >
              1,480,086 rooms around the world are waiting for you!
            </Typography>

            <SearchButton onClick={() => handleSearch(currentCity)}>
              <StyledSearchIcon />
            </SearchButton>
          </Container>
        </Box>

        {/* Destinations section */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 500,
              mb: 3,
              color: 'rgba(0, 0, 0, 0.87)',
              px: { xs: 2, sm: 0 }
            }}
          >
            Popular destinations
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            px: { xs: 2, sm: 0 }
          }}>
            {/* First row */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
              gap: 3,
            }}>
              {destinations.slice(0, 3).map((destination, index) => (
                <Box key={index} sx={{ height: { xs: '200px', sm: '300px' } }}>
                  <DestinationCard 
                    name={destination.name} 
                    image={destination.image}
                    onSearch={handleSearch}
                  />
                </Box>
              ))}
            </Box>

            {/* Second row */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
              gap: 3,
            }}>
              {destinations.slice(3, 6).map((destination, index) => (
                <Box key={index} sx={{ height: { xs: '200px', sm: '300px' } }}>
                  <DestinationCard 
                    name={destination.name} 
                    image={destination.image}
                    onSearch={handleSearch}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;