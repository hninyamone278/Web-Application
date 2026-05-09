import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminAppointments from './AdminAppointments';
import AdminReport from './AdminReport';

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 1, sm: 2, md: 4 }, py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 3, fontSize: { xs: '1.5rem', sm: '2rem' } }}>Admin Panel</Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Report" sx={{ minWidth: { xs: 70, sm: 90 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
        <Tab label="Products" sx={{ minWidth: { xs: 70, sm: 90 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
        <Tab label="Orders" sx={{ minWidth: { xs: 70, sm: 90 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
        <Tab label="Appointments" sx={{ minWidth: { xs: 80, sm: 110 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
      </Tabs>
      {tab === 0 && <AdminReport />}
      {tab === 1 && <AdminProducts />}
      {tab === 2 && <AdminOrders />}
      {tab === 3 && <AdminAppointments />}
    </Box>
  );
}
