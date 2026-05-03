import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WatchIcon from '@mui/icons-material/Watch';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const CATEGORY_META = {
  Rings: {
    icon: DiamondIcon,
    description: 'From solitaire diamonds to engraved bands — find the perfect ring for every moment.',
  },
  Necklaces: {
    icon: AutoAwesomeIcon,
    description: 'Delicate pendants and statement chains crafted in gold, silver, and pearl.',
  },
  Bracelets: {
    icon: WatchIcon,
    description: 'Charm bracelets, cuffs, and tennis styles to adorn every wrist.',
  },
  Earrings: {
    icon: BlurOnIcon,
    description: 'Studs, hoops, and drops — timeless designs for everyday elegance.',
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{ bgcolor: '#1a1a2e', color: '#d4af37', py: 12, textAlign: 'center' }}
        className="px-4"
      >
        <DiamondIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h2" sx={{ fontFamily: 'serif', mb: 2 }}>
          Timeless Elegance
        </Typography>
        <Typography variant="h6" sx={{ color: '#ccc', mb: 4, maxWidth: 500, mx: 'auto' }}>
          Discover our handcrafted jewellery collection — each piece tells a story.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: '#d4af37', color: '#1a1a2e', '&:hover': { bgcolor: '#b8972e' } }}
          onClick={() => navigate('/products')}
        >
          Shop Now
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ ml: 2, borderColor: '#d4af37', color: '#d4af37', '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' } }}
          onClick={() => navigate('/book-appointment')}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Shop by Category */}
      <Box className="max-w-7xl mx-auto px-4 py-16">
        <Typography variant="overline" sx={{ display: 'block', textAlign: 'center', color: '#d4af37', letterSpacing: 4, mb: 1 }}>
          Collections
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 2, textAlign: 'center' }}>
          Explore Our Collections
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6, maxWidth: 480, mx: 'auto' }}>
          Browse by category and find something crafted for you.
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 960, mx: 'auto' }}>
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.name] || {};
            const Icon = meta.icon || DiamondIcon;
            return (
              <Grid item xs={12} sm={6} md={6} key={cat.id} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: 450,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: 3, md: 5 },
                    pt: { xs: 4, md: 5 },
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      borderColor: '#d4af37',
                      boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
                    },
                  }}
                  elevation={0}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0, pb: 4 }}>
                    <Box sx={{ width: 68, height: 68, bgcolor: '#1a1a2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      <Icon sx={{ fontSize: 30, color: '#d4af37' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: 'serif', fontWeight: 400, mb: 1.5 }}>
                      {cat.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontSize: '0.88rem' }}>
                      {meta.description || 'Handcrafted pieces made to last a lifetime.'}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#d4af37',
                      borderColor: '#d4af37',
                      px: 3,
                      py: 1,
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      fontWeight: 600,
                      borderRadius: 0,
                      borderWidth: 1.5,
                      '&:hover': { bgcolor: '#d4af37', color: '#fff', borderColor: '#d4af37', borderWidth: 1.5 },
                    }}
                    onClick={() => navigate(`/products?category_id=${cat.id}`)}
                  >
                    Shop {cat.name}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{
              color: '#1a1a2e',
              borderColor: '#1a1a2e',
              px: 4,
              py: 1.5,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              fontWeight: 600,
              borderRadius: 0,
              borderWidth: 1.5,
              '&:hover': { bgcolor: '#1a1a2e', color: '#fff', borderColor: '#1a1a2e', borderWidth: 1.5 },
            }}
          >
            View All Products
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
