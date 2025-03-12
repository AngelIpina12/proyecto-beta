import React from 'react';

import  { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {  IconButton, Stack, Typography } from "@mui/material";

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';



import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';



import Slide from '@mui/material/Slide';
import ImageCard from './ImageCard';
import { YardAPI } from '@/services/YardAPI';


export const Controlcard = ({ aEventName,  aintRTrailerId, aintEventId }) => {


  const [datalist, setdatalist] = useState(
    [{
      intIndex: 0, intPhotoId: 0, intPhotoRefId: 0, intPhotoType: 0, strPhotoPath:''

    }]
  );

  const [currentPage, setCurrentPage] = useState(0);
  
  const [slideDirection, setSlideDirection] = useState('left');

  const cardsPerPage = 1;



  const handleNextPage = () => {
    setSlideDirection('left');
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setSlideDirection('right');
    setCurrentPage((prevPage) => prevPage - 1);
  };


  useEffect(() => {
    // validar datos para traer informacin en listado 
    try {

      if (aintEventId > 0) {

        let EventDat = new Object();
        let contval = 0;
        EventDat.aintEventId = aintEventId;
        EventDat.aintTrailerId = 0;
        EventDat.astrEventName = "";

        YardAPI.GetEventImageListPath({
          EventDat
        })
          .then((retobject) => {

            console.log(retobject.data);
            setdatalist(retobject.data);

        }) // then
      } // if (aintEventId > 0){

      

    } // try main 
    catch (aerror)
    {
      console.error('Error:', aerror);
    } //catch main

  }, []); // fin useeffect

  const containerWidth = cardsPerPage * 750; // 250px per card


  return (

    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: "730px",
        width: "100%",
        marginTop: "1px",
      }}
    >
      <IconButton
        onClick={handlePrevPage}
        sx={{ margin: 5 }}
        disabled={currentPage === 0}
      >
       < NavigateBeforeIcon />
      </IconButton>
      <Box sx={{ width: `${containerWidth}px`, height: "100%" }}>
        {datalist.map((card, index) => (
          <Box
            key={`card-${index}`}
            sx={{
              width: "100%",
              height: "100%",
              display: currentPage === index ? "block" : "none",
            }}
          >
            <Slide direction={slideDirection} in={currentPage === index}>
              <Stack
                spacing={2}
                direction="row"
                alignContent="center"
                justifyContent="center"
                sx={{ width: "100%", height: "100%" }}
              >
                {datalist
                  .slice(
                    index * cardsPerPage,
                    index * cardsPerPage + cardsPerPage
                  )
                  .map((item, index) => (
                    <Box key={index}>
                      <ImageCard aimage_url={item.strPhotoPath} aname={item.strname } />
                    </Box>
                  ))}
              </Stack>
            </Slide>
          </Box>
        ))}
      </Box>
      <IconButton
        onClick={handleNextPage}
        sx={{
          margin: 5,
        }}
        disabled={
          currentPage >= Math.ceil((datalist.length || 0) / cardsPerPage) - 1
        }
      >

        <NavigateNextIcon />
      </IconButton>
    </Box>

  );
}

/*export default Controlcard;*/