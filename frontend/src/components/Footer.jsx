import { Box, Typography, Link, Divider } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: '#1a1a2e', color: '#d4af37', py: { xs: 3, md: 5 }, mt: 'auto', px: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}
    >
      <DiamondIcon sx={{ mb: 1, fontSize: { xs: 24, md: 32 } }} />
      <Typography variant="body2" sx={{ mb: 1.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
        &copy; {new Date().getFullYear()} Hnin Ymo Jewellery. All rights reserved.
      </Typography>
      <Divider sx={{ borderColor: 'rgba(212,175,55,0.2)', mb: 3 }} />
      <Typography variant="overline" sx={{ display: 'block', letterSpacing: 2, mb: 2, color: '#d4af37', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
        Contact Us
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon sx={{ fontSize: { xs: 14, md: 16 }, color: '#d4af37' }} />
          <Link href="tel:+959123456789" underline="hover" sx={{ color: '#ccc', fontSize: { xs: '0.8rem', md: '0.85rem' } }}>
            +95 9 123 456 789
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ fontSize: { xs: 14, md: 16 }, color: '#d4af37' }} />
          <Link href="mailto:hello@hninymo.com" underline="hover" sx={{ color: '#ccc', fontSize: { xs: '0.8rem', md: '0.85rem' } }}>
            hello@hninymo.com
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: { xs: 14, md: 16 }, color: '#d4af37' }} />
          <Typography variant="body2" sx={{ color: '#ccc', fontSize: { xs: '0.8rem', md: '0.85rem' } }}>
            Mon – Sat: 10:00 AM – 7:00 PM
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
