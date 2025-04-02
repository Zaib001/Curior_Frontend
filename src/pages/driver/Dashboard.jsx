import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import {
  LocalShipping, Done, PendingActions
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';

const stats = [
  { label: 'Assigned Parcels', value: 25, icon: <LocalShipping fontSize="large" />, color: '#2196f3' },
  { label: 'Picked Up', value: 15, icon: <PendingActions fontSize="large" />, color: '#ff9800' },
  { label: 'Delivered', value: 10, icon: <Done fontSize="large" />, color: '#4caf50' },
];

const parcels = [
  { id: 'PCL001', receiver: 'John Doe', address: 'New York', status: 'Assigned' },
  { id: 'PCL002', receiver: 'Jane Smith', address: 'Los Angeles', status: 'Picked Up' },
  { id: 'PCL003', receiver: 'Mike Johnson', address: 'Miami', status: 'Delivered' },
  { id: 'PCL004', receiver: 'Sarah Lee', address: 'Chicago', status: 'Assigned' },
];

const DriverDashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>Driver Dashboard</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((card, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: card.color, color: '#fff', borderRadius: 3, boxShadow: 3 }}>
              <Box mr={2}>{card.icon}</Box>
              <Box>
                <Typography variant="h6">{card.value}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>{card.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bar Chart */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Typography fontWeight={600} mb={2}>Parcel Status Overview</Typography>
        <BarChart
          height={300}
          series={[
            { data: [10, 15, 25], label: 'Parcels' }
          ]}
          xAxis={[{ scaleType: 'band', data: ['Delivered', 'Picked Up', 'Assigned'] }]}
        />
      </Card>

      {/* Assigned Parcels Table */}
      <Card sx={{ p: 2 }}>
        <Typography fontWeight={600} mb={2}>Assigned Parcels</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Parcel ID</strong></TableCell>
                <TableCell><strong>Receiver</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parcels.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.receiver}</TableCell>
                  <TableCell>{row.address}</TableCell>
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
                          row.status === 'Picked Up' ? '#ffe082' :
                          '#e3f2fd',
                      }}
                    >
                      {row.status}
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

export default DriverDashboard;
