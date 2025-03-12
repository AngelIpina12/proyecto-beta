import React from 'react';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { IconButton, Stack, Typography } from "@mui/material";

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


import Slide from '@mui/material/Slide';
import ImageCard from './ImageCard';
import { YardAPI } from '@/services/YardAPI';
import { GraphPhotosAPI } from '@/services/GraphPhotosAPI';


export const Controlcard = ({ aEventName, aintRTrailerId, aintEventId }) => {


  const [datalist, setdatalist] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const [slideDirection, setSlideDirection] = useState('left');

  const cardsPerPage = 1;

  const [graphPhotos, setGraphPhotos] = useState([]);


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

      //if (aintEventId > 0) {
      {

        let EventDat = new Object();
        let contval = 0;
        EventDat.aintEventId = aintEventId;
        EventDat.aintTrailerId = aintRTrailerId;
        EventDat.astrEventName = aEventName

        YardAPI.GetEventImageListPath({
          EventDat
        })
          .then((retobject) => {

            console.log(retobject.data);
            setdatalist(retobject.data);

          }) // then
      } // if (aintEventId > 0){



    } // try main 
    catch (aerror) {
      console.error('Error:', aerror);
    } //catch main

  }, []); // fin useeffect

  useEffect(() => {
    if (datalist && datalist.length > 0) {
      const payload = {
        Keywords: datalist.map(item => item.strname)
      };
      console.log("Payload para GetGraphPhotos:", payload);
      GraphPhotosAPI.GetPhotos(payload)
        .then(response => {
          console.log("Respuesta de GetGraphPhotos:", response);
          setGraphPhotos(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error("Error al obtener imágenes desde Graph:", error);
        });
    }
  }, [datalist]);

  const containerWidth = cardsPerPage * 750; // 250px per card
  const totalPages = graphPhotos.length;

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
        <NavigateBeforeIcon />
      </IconButton>
      <Box sx={{ width: "100%", height: "100%" }}>
        {graphPhotos.map((photo, index) => (
          <Box
            key={`card-${index}`}
            sx={{
              width: "100%",
              height: "90%",
              display: currentPage === index ? "block" : "none",
            }}
          >
            <Slide direction={slideDirection} in={currentPage === index}>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%", height: "100%" }}
              >
                <Box sx={{ width: "100%", height: "100%" }}>
                  <ImageCard aimage_url={photo.downloadUrl} aname={photo.name} />
                </Box>
              </Stack>
            </Slide>
          </Box>
        ))}
      </Box>
      <IconButton
        onClick={handleNextPage}
        sx={{ margin: 5 }}
        disabled={currentPage >= totalPages - 1}
      >
        <NavigateNextIcon />
      </IconButton>
    </Box>

  );
}

/*export default Controlcard;*/