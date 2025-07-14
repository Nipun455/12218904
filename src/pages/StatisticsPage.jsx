import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const StatisticsPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('urlMappings');
    const parsed = stored ? JSON.parse(stored) : {};
    setRecords(Object.values(parsed));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Link Insights</Typography>
      {records.map((item) => (
        <Box key={item.shortcode} mb={2}>
          <Typography><strong>Code:</strong> {item.shortcode}</Typography>
          <Typography><strong>Destination:</strong> {item.longUrl}</Typography>
          <Typography><strong>Created On:</strong> {item.createdAt}</Typography>
          <Typography><strong>Valid Until:</strong> {new Date(item.expiresAt).toLocaleString()}</Typography>
          <Typography><strong>Total Clicks:</strong> {item.clicks.length}</Typography>
          {item.clicks.map((entry, idx) => (
            <Box key={idx} ml={2}>
              <Typography>- Timestamp: {entry.timestamp}</Typography>
              <Typography>- Referrer: {entry.referrer}</Typography>
              <Typography>- Location: {entry.location}</Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default StatisticsPage;
