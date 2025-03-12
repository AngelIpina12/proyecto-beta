import React from 'react';

import { Card, CardContent, Typography, Stack } from '@mui/material';

import CardMedia from '@mui/material/CardMedia';



 const ImageCard = ({ aimage_url, aname }) => {
  return (
    <Card sx={{ width: "750px", height: "725px" }}>
      <CardMedia
        component="img"
        height="660"
        image={aimage_url}
        title={aname}
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <Stack direction="row" spacing={2}>
        
          <Typography gutterBottom variant="body2" component="div">
            {aname}
          </Typography>
          
          <Typography gutterBottom variant="body2" component="div">
            {aimage_url} 
          </Typography>

         
        </Stack>        
      </CardContent>
    </Card>
  );
}
export default ImageCard;