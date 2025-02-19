import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import { WildData as itemData } from './WildData';

// ✅ Styled Paper for Image Captions
const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

export default function HomeGrid({ searchItem }) {
  // ✅ Filter images based on search input
  const wildlifePhotos = itemData.filter((item) =>
    item.title.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      {/* ✅ Added Container to Center Masonry Grid */}
      <Box sx={{ maxWidth: 1200, width: '100%', p: 2 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {wildlifePhotos.map((item) => (
            <Box key={item.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                style={{
                  width: '100%', // ✅ Ensures images fit properly
                  display: 'block',
                  borderRadius: '8px',
                  objectFit: 'cover', // ✅ Prevents distortion
                }}
              />
              <Label>{item.title}</Label>
            </Box>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
}
