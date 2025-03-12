import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Stack, TextField, Container, Typography, Box, Grid, CardContent, useTheme, InputLabel } from '@mui/material';
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from '@mui/material/CssBaseline';

import { userAPI } from '@/services/userAPI';
import { HOME_ROUTE, YARD_SUMMARY_ROUTE } from '../routes';
import md5 from "md5";
import { USER_DATA } from '../../utils/constants';
import { isAuthenticated } from '../../utils';
import CQlogo from '@/assets/CQlogo.jpg';



const IMGstyles = {
  root: {
    // height: "auto",
    paddingBottom: "100%",
    display: "block",
    position: "relative"
    // top:0
    // maxHeight:0,
    // minHeight:"372px"
  },
  media: {
    position: "absolute",

    left: 0,
    top: 0,
    height: "100%", //auto
    // maxWidth:"100%"
    objectFit: "scale-down"
  }
};

export const Login = () => {
  const theme = useTheme(); // Using the theme for consistent styling

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(HOME_ROUTE);
    }
  }, [navigate]);


  const [showerrorstate, setShowerrorstate] = useState(false);

  const [textstate, setTextstate] = useState('')
  const [isErrorBoolst, setIsErrorBoolst] = useState(true)

  const textUsernamedRef = useRef();
  const textPasswordRef = useRef();
  const strloginerror = "'Usuario/Password invalido(s)'";
  
  const handleClick = async () => {
    try {
      const lusername = textUsernamedRef.current.value;
      const lpassword = textPasswordRef.current.value;
      const lhash = md5(lpassword);
  
      const singleDat = {
        userid: lusername,
        password: lhash
      };
  
      try {
        const retobject = await userAPI.validate({ singleDat });
  
        if (retobject.status === 200) {
          setIsErrorBoolst(false);
          setTextstate('');
  
          localStorage.setItem(USER_DATA, retobject.data);
          navigate(YARD_SUMMARY_ROUTE);
        } else {
          setIsErrorBoolst(true);
          setTextstate(strloginerror);
        }
      } catch (error) {
        setIsErrorBoolst(true);
        setTextstate('Error de conexion');
        console.error("userError:", error);
      }
    } catch (error) {
      setIsErrorBoolst(true);
      setTextstate('Error de conexion');
      console.error("catch:", error);
    }
  };


  return (

    <Card>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/CUSTOMERBKEND/assets/CargoBack2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',

        }}
      >

        <CardContent sx={{ position: 'relative', zIndex: 2, }}>

          <Container component="main" maxWidth="xs">

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 1, height: "90vh" }}
            >
              <Card
                sx={{


                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  boxShadow: `0 8px 24px ${theme.palette.grey[400]}`,
                  transition: 'transform 0.15s ease-in-out', // Smooth transition for hover effect
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 12px 36px ${theme.palette.grey[500]}`, // Increased shadow on hover
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,

                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease-in-out', // Smooth transition for hover effect
                    '&:hover': {
                      opacity: 0.5,
                    }
                  }}
                />
                <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
                


                    <Container component="main" maxWidth="xs">
                      <CssBaseline />


                      <Box
                        sx={{

                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          boxShadow: 5,
                          px: 2,
                          py: 2,

                        }}
                      >
                        <Grid container spacing={1}>
                          < Grid item xs={16} >


                            <Box sx={IMGstyles.root}>
                              <CardMedia
                                component={"img"}
                                sx={IMGstyles.media}
                                src={CQlogo}
                              />
                            </Box>

                          </Grid>


                        </Grid>
                       
                          <Typography component="h1" variant="h5">
                            Welcome
                          </Typography>
                          <Typography component="h1" variant="h5">
                            Customer Portal
                          </Typography>
                  
                        
                        {/*<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>*/}

                        <Box component="form" sx={{ mt: 3 }}>
                          <Grid container spacing={2}>

                            <Grid item xs={12}>
                              <TextField
                                required
                                fullWidth
                                id="username"
                                label="User name"
                                name="username"
                                autoComplete="User name"
                                inputRef={textUsernamedRef}
                                helperText=""
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="password"
                                inputRef={textPasswordRef}
                                helperText=""
                              />
                            </Grid>
                            <InputLabel color={"success"} error={isErrorBoolst} >
                              {textstate}
                            </InputLabel>
                          </Grid>


                          <Button

                            onClick={handleClick}

                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Sign Up
                          </Button>

                        </Box>

                      </Box>


                    </Container>


                

                </CardContent>
              </Card>


            </Stack>



          </Container>
        </CardContent>


      </ Box>
    </ Card>




  );
};
