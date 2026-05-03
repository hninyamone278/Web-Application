import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminAppointments from './AdminAppointments';
import AdminReport from './AdminReport';

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 3 }}>Admin Panel</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Report" />
        <Tab label="Products" />
        <Tab label="Orders" />
        <Tab label="Appointments" />
      </Tabs>
      {tab === 0 && <AdminReport />}
      {tab === 1 && <AdminProducts />}
      {tab === 2 && <AdminOrders />}
      {tab === 3 && <AdminAppointments />}
    </Box>
  );
}
