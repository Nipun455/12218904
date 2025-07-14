import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { generateShortCode, isValidURL } from '../utils/Shortener';
import { logEvent } from '../utils/LoggerMiddleware';

const ShortenerPage = () => {
  const [inputList, setInputList] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [outputList, setOutputList] = useState([]);

  const updateField = (index, key, val) => {
    const list = [...inputList];
    list[index][key] = val;
    setInputList(list);
  };

  const addNewInput = () => {
    if (inputList.length >= 5) return;
    setInputList([...inputList, { longUrl: '', validity: '', shortcode: '' }]);
  };

  const createShortLinks = () => {
    const generated = [];
    inputList.forEach(({ longUrl, validity, shortcode }) => {
      if (!isValidURL(longUrl)) return;

      const records = JSON.parse(localStorage.getItem('urlMappings')) || {};
      let code = shortcode || generateShortCode();

      while (records[code]) {
        code = generateShortCode();
      }

      const duration = (validity ? parseInt(validity) : 30) * 60000;
      const entry = {
        longUrl,
        shortcode: code,
        createdAt: new Date().toISOString(),
        expiresAt: Date.now() + duration,
        clicks: [],
      };

      records[code] = entry;
      localStorage.setItem('urlMappings', JSON.stringify(records));
      logEvent(`Created: ${longUrl} as ${code}`);
      generated.push(entry);
    });

    setOutputList(generated);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {inputList.map((item, idx) => (
        <Box key={idx} display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="Original URL"
            value={item.longUrl}
            onChange={(e) => updateField(idx, 'longUrl', e.target.value)}
          />
          <TextField
            label="Validity (mins)"
            type="number"
            value={item.validity}
            onChange={(e) => updateField(idx, 'validity', e.target.value)}
          />
          <TextField
            label="Custom Code"
            value={item.shortcode}
            onChange={(e) => updateField(idx, 'shortcode', e.target.value)}
          />
        </Box>
      ))}
      <Button variant="outlined" onClick={addNewInput} disabled={inputList.length >= 5}>Add More</Button>
      <Button variant="contained" onClick={createShortLinks} sx={{ ml: 2 }}>Generate</Button>

      <Box mt={4}>
        {outputList.map((res) => (
          <Typography key={res.shortcode}>
            {window.location.origin}/{res.shortcode} (Expires: {new Date(res.expiresAt).toLocaleString()})
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ShortenerPage;
