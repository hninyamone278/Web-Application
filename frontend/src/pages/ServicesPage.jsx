import {
  Box, Typography, Grid, Card, CardContent, Button, Divider,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BrushIcon from '@mui/icons-material/Brush';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BuildIcon from '@mui/icons-material/Build';
import FlareIcon from '@mui/icons-material/Flare';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  {
    icon: AutoFixHighIcon,
    title: 'Gold Replating',
    purpose: 'Gold Replating',
    description:
      'Restore the warm golden brilliance of your favourite pieces. Our expert artisans apply a fresh coat of 18k gold using professional electroplating techniques.',
    detail: 'Turnaround: 5–7 business days',
  },
  {
    icon: BrushIcon,
    title: 'Custom Engraving',
    purpose: 'Custom Engraving',
    description:
      'Personalise rings, bracelets, and pendants with initials, dates, coordinates, or a meaningful message — handcrafted with precision laser engraving.',
    detail: 'Turnaround: 3–5 business days',
  },
  {
    icon: ZoomOutMapIcon,
    title: 'Ring Sizing',
    purpose: 'Ring Sizing',
    description:
      'Ensure a perfect, comfortable fit with our professional ring sizing service. We resize up or down by up to three sizes on most styles.',
    detail: 'Turnaround: 2–4 business days',
  },
  {
    icon: CleaningServicesIcon,
    title: 'Cleaning & Polishing',
    purpose: 'Jewellery Cleaning & Polishing',
    description:
      'Restore the original sparkle to your jewellery with our ultrasonic cleaning and professional hand polishing service.',
    detail: 'Turnaround: 1–2 business days',
  },
  {
    icon: BuildIcon,
    title: 'Jewellery Repair',
    purpose: 'Jewellery Repair',
    description:
      'From broken clasps to loose stones and bent prongs — our skilled jewellers restore your treasured pieces to their original condition.',
    detail: 'Turnaround: varies by repair',
  },
  {
    icon: FlareIcon,
    title: 'Rhodium Plating',
    purpose: 'Rhodium Plating',
    description:
      'Protect and brighten white gold with a fresh rhodium coat, adding a brilliant, tarnish-resistant finish that lasts for years.',
    detail: 'Turnaround: 3–5 business days',
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1a1a2e', color: '#fff', py: 10, textAlign: 'center', px: 4 }}>
        <Typography variant="overline" sx={{ color: '#d4af37', letterSpacing: 4 }}>
          Client Services
        </Typography>
        <Typography variant="h3" sx={{ fontFamily: 'serif', color: '#d4af37', mt: 1, mb: 2 }}>
          Care &amp; Personalisation
        </Typography>
        <Typography variant="body1" sx={{ color: '#ccc', maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}>
          Every piece deserves to be cherished. From restoration to personalisation, our expert
          craftspeople are here to keep your jewellery looking its best.
        </Typography>
      </Box>

      {/* Services grid */}
      <Box className="max-w-7xl mx-auto px-4 py-16">
        <Grid container spacing={4}>
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={s.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: 400,
                    width: '100%',
                    maxWidth: 360,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      borderColor: '#d4af37',
                      boxShadow: '0 4px 24px rgba(212,175,55,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: '#1a1a2e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      <Icon sx={{ color: '#d4af37', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 1.5 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
                      {s.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" sx={{ color: '#d4af37', fontWeight: 600, letterSpacing: 0.5 }}>
                      {s.detail}
                    </Typography>
                  </CardContent>
                  <Box sx={{ px: 4, pb: 4 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        color: '#d4af37',
                        borderColor: '#d4af37',
                        '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' },
                      }}
                      onClick={() =>
                        navigate(`/book-appointment?purpose=${encodeURIComponent(s.purpose)}`)
                      }
                    >
                      Book This Service
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Bottom CTA */}
        <Box
          sx={{
            mt: 10,
            bgcolor: '#1a1a2e',
            borderRadius: 2,
            py: 6,
            px: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontFamily: 'serif', color: '#d4af37', mb: 1.5 }}>
            Not sure which service you need?
          </Typography>
          <Typography variant="body1" sx={{ color: '#ccc', mb: 4, maxWidth: 460, mx: 'auto' }}>
            Book a general consultation and one of our advisors will guide you through the best
            options for your piece.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: '#d4af37', color: '#1a1a2e', '&:hover': { bgcolor: '#b8972e' } }}
            onClick={() => navigate('/book-appointment')}
          >
            Book a Consultation
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
