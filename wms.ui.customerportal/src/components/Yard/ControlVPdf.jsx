import React from 'react';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { IconButton, Stack, Typography } from "@mui/material";

//import MenuIcon from '@mui/icons-material/Menu';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';



import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';



import Slide from '@mui/material/Slide';
import { PDFObj } from './PDFObj';

import { YardAPI } from '@/services/YardAPI';



export const ControlVPdf = ({ aEventName, aintRTrailerId, aintEventId }) => {



  const [datalist, setdatalist] = useState(
    [{
      intIndex: 0, intFileId: 0, intFileRefId: 0, intFileType: 0, strFilePath: '', strFileName :''
      
    }]
  );

  const [currentPage, setCurrentPage] = useState(0);
  // slideDirection is the direction that the cards will slide in

  const [slideDirection, setSlideDirection] = useState('left');

  const cardsPerPage = 1;


  // these two functions handle changing the pages
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

        YardAPI.GetEventFileListPath({
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
                      <PDFObj afile_url={item.strFilePath} />

                    

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

//export default ControlVPdf;