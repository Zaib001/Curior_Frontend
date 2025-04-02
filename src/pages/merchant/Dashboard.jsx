import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import {
  LocalShipping, ShoppingCart, Payments, TrackChanges
} from '@mui/icons-material';
import { BarChart, PieChart, LineChart, ScatterChart } from '@mui/x-charts';
import CountUp from 'react-countup';
import { getMerchantParcels, getMerchantOrders, getAnalytics } from '../../services/merchantService';
import { getParcels } from '../../services/api';

const Dashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const parcelRes = await getParcels();
        const orderRes = await getMerchantOrders();
        const analyticsRes = await getAnalytics();

        setParcels(Array.isArray(parcelRes.data) ? parcelRes.data : []);

        setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
        setAnalytics(analyticsRes || {});
      } catch (error) {
        console.error('Error loading merchant dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading Dashboard...</div>;
  const inTransit = parcels.filter(p => p.currentStatus === 'Dispatched').length;
  const delivered = parcels.filter(p => p.currentStatus === 'Delivered').length;
  const revenue = analytics.totalRevenue || 0;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingCart fontSize="large" />, color: '#3f51b5' },
    { label: 'Parcels In Transit', value: inTransit, icon: <LocalShipping fontSize="large" />, color: '#009688' },
    { label: 'Delivered Parcels', value: delivered, icon: <TrackChanges fontSize="large" />, color: '#4caf50' },
    { label: 'Total Revenue', value: `$${revenue}`, icon: <Payments fontSize="large" />, color: '#ff9800' },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>Merchant Dashboard</Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: card.color, color: '#fff', borderRadius: 3, boxShadow: 4 }}>
              <Box mr={2}>{card.icon}</Box>
              <Box>
                <Typography variant="h6">
                  <CountUp
                    end={parseFloat(card.value.toString().replace(/[^0-9.]/g, ''))}
                    duration={2}
                    prefix={card.value[0] === '$' ? '$' : ''}
                    separator=","
                  />
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>{card.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Parcels Comparison (Bar Chart)</Typography>
            <BarChart
              height={300}
              series={[{ data: [inTransit, delivered], label: 'Parcels', stack: 'total' }]}
              xAxis={[{ scaleType: 'band', data: ['In Transit', 'Delivered'] }]}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Order Trends (Line Chart)</Typography>
            <LineChart
              height={300}
              series={[{ curve: 'linear', data: [3, 5, 7, 4, 6] }]}
              xAxis={[{ scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }]}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Pie + Scatter */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Parcel Distribution (Pie Chart)</Typography>
            <PieChart
              series={[{
                data: [
                  { id: 0, value: delivered, label: 'Delivered' },
                  { id: 1, value: inTransit, label: 'In Transit' },
                  { id: 2, value: parcels.length - delivered - inTransit, label: 'Others' },
                ],
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
              }]}
              width={400}
              height={300}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Delivery Patterns (Scatter)</Typography>
            <ScatterChart
              height={300}
              grid={{ horizontal: true, vertical: true }}
              series={[{
                data: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 3 }, { x: 4, y: 5 }],
                valueFormatter: ({ x, y }) => `(${x}, ${y})`
              }]}
              xAxis={[{ min: 0, max: 5 }]}
              yAxis={[{ min: 0, max: 6 }]}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Card sx={{ p: 2 }}>
        <Typography fontWeight={600} mb={2}>Recent Orders</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Receiver</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((row) => (
                <TableRow key={row.orderId}>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.customerName || 'N/A'}</TableCell>
                  <TableCell>{row.shippingAddress || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        display: 'inline-block',
                        backgroundColor:
                          row.status === 'Delivered' ? '#c8e6c9' :
                            row.status === 'In Transit' ? '#ffe082' :
                              '#e0e0e0',
                      }}
                    >
                      {row.status || 'Pending'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Dashboard;
