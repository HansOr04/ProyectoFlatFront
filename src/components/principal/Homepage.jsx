import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Paper,
  InputBase,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const destinations = [
  { name: "Quito", image: "https://images.pexels.com/photos/18309489/pexels-photo-18309489/free-photo-of-ciudad-iglesia-catolico-cristianismo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Guayaquil", image: "https://q-xx.bstatic.com/xdata/images/hotel/max500/415749624.jpg?k=2ec87ac3f1765aedf961419ebb9ea6fe273b65563153396cf7f3c7ad39625607&o=" },
  { name: "Ibarra", image: "https://www.lahora.com.ec/wp-content/uploads/2023/09/IBARRA-PANORAMICA.png" },
  { name: "Ambato", image: "https://cdn.voxlocalis.net/media/cache/9e/c5/9ec5afcd72d1a1ab67f2060767e414a4.jpg" },
  { name: "Cuenca", image: "https://irp.cdn-website.com/23be95e4/dms3rep/multi/Imagen+1-b5e9bd4b.png" },
  { name: "Casa Blanca", image: "https://images.trvl-media.com/lodging/64000000/63890000/63888800/63888726/446b1759.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill" },
];

const DestinationCard = ({ name, image, sx = {} }) => (
  <Card
    sx={{
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease-in-out',
      height: '100%',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      ...sx
    }}
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
const HomePage = () => {
  const muiTheme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1296px) and (min-height:938.67px)');

  const SearchComponent = () => (
    isLargeScreen ? (
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          maxWidth: 700,
          mx: 'auto',
          borderRadius: '50px',
          p: '6px 6px 6px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          bgcolor: 'white',
        }}
      >
        {['Location', 'Check-in', 'Check-out', 'Guests'].map((label, index) => (
          <Box
            key={label}
            sx={{
              flex: 1,
              minWidth: 150,
              px: 2,
              py: 1,
              borderRight: index !== 3 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
            }}
          >
            <Typography
              sx={{
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              {label}
            </Typography>
            <InputBase
              placeholder={
                label === 'Location' ? 'Where are you going?' :
                label === 'Guests' ? 'Number of guests' : 'Add date'
              }
              fullWidth
              sx={{
                fontSize: '0.95rem',
                color: 'rgba(0, 0, 0, 0.7)',
                '& input::placeholder': {
                  color: 'rgba(0, 0, 0, 0.4)',
                  fontSize: '0.9rem'
                }
              }}
            />
          </Box>
        ))}
        <IconButton
          sx={{
            bgcolor: '#1FD1D7',
            color: 'white',
            width: 50,
            height: 50,
            m: 0.5,
            '&:hover': {
              bgcolor: '#17A5AA',
            }
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Paper>
    ) : (
      <IconButton
        sx={{
          bgcolor: '#1FD1D7',
          color: 'white',
          width: { xs: '60px', sm: '70px' },
          height: { xs: '60px', sm: '70px' },
          '&:hover': {
            bgcolor: '#17A5AA',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(31, 209, 215, 0.4)',
        }}
      >
        <SearchIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />
      </IconButton>
    )
  );

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

            <SearchComponent />
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
    {/* Primera fila */}
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
      gap: 3,
    }}>
      <Box sx={{ height: { xs: '200px', sm: '300px' } }}>
        <DestinationCard 
          name={destinations[0].name} 
          image={destinations[0].image}
        />
      </Box>
      <Box sx={{ height: { xs: '200px', sm: '300px' } }}>
        <DestinationCard 
          name={destinations[1].name} 
          image={destinations[1].image}
        />
      </Box>
      <Box sx={{ height: { xs: '200px', sm: '300px' } }}>
        <DestinationCard 
          name={destinations[2].name} 
          image={destinations[2].image}
        />
      </Box>
    </Box>

    {/* Segunda fila */}
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
      gap: 3,
    }}>
      <Box sx={{ height: { xs: '200px', sm: '300px' } }}>
        <DestinationCard 
          name={destinations[3].name} 
          image={destinations[3].image}
        />
      </Box>
      <Box sx={{ height: { xs: '200px', sm: '300px' } }}>
        <DestinationCard 
          name={destinations[4].name} 
          image={destinations[4].image}
        />
      </Box>
      <Box sx={{ height: { xs: '200px', sm: '300px' } }}>
        <DestinationCard 
          name={destinations[5].name} 
          image={destinations[5].image}
        />
      </Box>
    </Box>
  </Box>
</Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;