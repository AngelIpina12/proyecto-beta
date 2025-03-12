import React from 'react';

import { Card, CardContent, Typography, Stack } from '@mui/material';

import CardMedia from '@mui/material/CardMedia';



const ImageCard = ({ aimage_url, aname }) => {
  return (
      <CardMedia
        component="img"
        image={aimage_url}
        title={aname}
        sx={{
          width: "100%",
          height: "calc(100% - 60px)",
          objectFit: "cover",
        }}
      />
  );
}
export default ImageCard;