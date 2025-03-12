import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Card, CardContent, Typography, CardMedia, Stack, Box, Grid } from '@mui/material';
import { Chip } from '@mui/material';

import { ArrowNextComp } from './ArrowNextComp';
import { CardModal } from './CardModal'
import { CardPDFModal } from './CardPDFModal';

export const EventComp = ({ aEventName, aEventDate, aRecFolio, aTRFolio, aintRTrailerId, aintEventId }) => {

  const [TRFoliostate, setTRFoliostate] = useState('');
  const [RecFoliostate, setRecFolio] = useState('')

  const [showImageControl, setshowImageControl] = useState(false);
  const [showFileControl, setshowFileControl] = useState(false);


  const [open, setOpen] = useState(false);
  const [lintRecid, setlintRecid] = useState(0);
  const [lintEventid, setlintEventid] = useState(0);
  const [lstrEventname, setlstrEventname] = useState('');


  const fnShowModal = (argvalue) => {
    setshowImageControl(argvalue);
  };

  const fnShowFileModal = (fargvalue) => {
    setshowFileControl(fargvalue);
  };

  const handleBtnFileClick = () => {

    setlintRecid(aintRTrailerId);
    setlintEventid(aintEventId);
    setlstrEventname(aEventName);

    setshowFileControl(!showFileControl);

  };

  const handleBtnImgClick = () => {


    setlintRecid(aintRTrailerId);
    setlintEventid(aintEventId);
    setlstrEventname(aEventName);

    setshowImageControl(!showImageControl);
  };

  return (


    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} >


          <Stack direction="column" spacing={1} >
            <Chip label={aEventName}
              sx={{ fontSize: '22px', fontWeight: 'bold', backgroundColor: '#ebcf33', color: 'black' }}
            />
            <Chip label={aEventDate}
              sx={{ fontSize: '20px', backgroundColor: '#ebcf33', color: 'black' }}
            />
            <Stack direction="row" spacing={1} >
              <Button
                variant="contained"
                sx={{ fontSize: '24px', backgroundColor: '#b5e550', color: 'black' }}
                onClick={handleBtnFileClick}
              >Docs</Button>
              {showFileControl &&
                <CardPDFModal
                  aintRecid={lintRecid}
                  aintEventid={lintEventid}
                  astrEventname={aEventName}
                  fnShowFileModal={fnShowFileModal}
                />
              }
              <Button
                variant="contained"
                sx={{ fontSize: '24px', backgroundColor: '#b5e550', color: 'black' }}
                onClick={handleBtnImgClick}
              >Photos</Button>
              {showImageControl &&
                <CardModal
                  aintRecid={lintRecid}
                  aintEventid={lintEventid}
                  astrEventname={aEventName}
                  fnShowModal={fnShowModal}
                />



              }

            </Stack>
          </Stack>
          <Stack direction="column" spacing={6} >
            <Stack direction="column" spacing={1} >
            </Stack>
            <Stack direction="column" spacing={1} >
              <ArrowNextComp />
            </Stack>
            <Stack direction="column" spacing={1} >

            </Stack>

          </Stack>
        </Stack>



      </CardContent>
    </Card>

  );
}; //export const EventComp = () => {
