import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  CircularProgress, Card, CardContent, Grid, Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/report')
      .then((r) => setData(r.data))
      .catch(() => setError('Could not load report data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box className="flex justify-center py-12"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const totalRevenue = (data.monthlySales || []).reduce((s, m) => s + parseFloat(m.revenue || 0), 0);
  const totalOrders = (data.monthlySales || []).reduce((s, m) => s + parseInt(m.order_count || 0, 10), 0);
  const bestSeller = data.topProducts?.[0];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Sales Report</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={2} sx={{ borderTop: '4px solid #d4af37', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 36, color: '#d4af37', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" fontWeight="bold">{Math.round(totalRevenue).toLocaleString()} MMK</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={2} sx={{ borderTop: '4px solid #1a1a2e', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingCartIcon sx={{ fontSize: 36, color: '#1a1a2e', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">Total Orders</Typography>
              <Typography variant="h5" fontWeight="bold">{totalOrders.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={2} sx={{ borderTop: '4px solid #4caf50', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 36, color: '#4caf50', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">Best Seller</Typography>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {bestSeller?.product?.name || '—'}
              </Typography>
              {bestSeller && (
                <Typography variant="caption" color="text.secondary">
                  {parseInt(bestSeller.total_sold, 10).toLocaleString()} sold
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Selling Products */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Top Selling Products</Typography>
      <Paper variant="outlined" sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>#</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Qty Sold</TableCell>
              <TableCell align="right">Revenue (MMK)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data.topProducts || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No sales data yet.
                </TableCell>
              </TableRow>
            ) : (
              data.topProducts.map((item, idx) => (
                <TableRow key={item.product_id} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{item.product?.name || `Product #${item.product_id}`}</TableCell>
                  <TableCell align="right">{parseInt(item.total_sold, 10).toLocaleString()}</TableCell>
                  <TableCell align="right">{Math.round(parseFloat(item.total_revenue)).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Monthly Sales */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Monthly Sales</Typography>
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Month</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Revenue (MMK)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data.monthlySales || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No sales data yet.
                </TableCell>
              </TableRow>
            ) : (
              data.monthlySales.map((m) => (
                <TableRow key={`${m.year}-${m.month}`} hover>
                  <TableCell>{MONTH_NAMES[m.month - 1]} {m.year}</TableCell>
                  <TableCell align="right">{parseInt(m.order_count, 10).toLocaleString()}</TableCell>
                  <TableCell align="right">{Math.round(parseFloat(m.revenue)).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
