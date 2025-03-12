import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Grid, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

import { LOGIN_ROUTE } from "../../Pages/routes";
import { ListItems } from "./ListItems";
import { userAPI } from '@/services/userAPI';
import { USER_DATA } from "../../utils/constants";
import { getToken, getTokenInfo } from "../../utils";



const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
   
  }), 
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
   
    }),
  }), 
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
      backgroundColor: '#0a3254',
    },
  }),
);

export const Menu = ({ drawerOpen, setDrawerOpen }) => {
  // const [open, setOpen] = useState(true);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    // setOpen(!open);
    setDrawerOpen(!drawerOpen);
  };
  const navigate = useNavigate();
  const flogout = () => {
    localStorage.removeItem(USER_DATA);
    navigate(LOGIN_ROUTE, { });
  };


  const [Companynamestate, setCompanynamestate] = useState('')
  const [WareHouseNamestate, setWareHouseName] = useState('')
  const [UserNamestate, setUserNamestate] = useState('')


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const ldata = getTokenInfo();
        const token = getToken();
        const lintid = ldata.nameid;
  
        const singleDat = {
          UserId: lintid,
          UserName: "",
          PWD: "",
          Type: ""
        };
  
        if (singleDat.UserId > 0) {
          try {
            const retobject = await userAPI.getUserInfo({
              singleDat,
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
  
            if (retobject.data[0].userId > 0) {
              setCompanynamestate(retobject.data[0].customer);
              setWareHouseName(retobject.data[0].wareHouse);
              setUserNamestate(`${retobject.data[0].firstName} ${retobject.data[0].lastName}`);
            }
          } catch (error) {
            console.error("userError:", error);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchUserInfo();
  }, []); // fin useEffect


  return (
    <Box sx={{ flexGrow: 1  }}>
      <AppBar position="absolute" open={drawerOpen}>
        <Toolbar sx={{ backgroundColor: '#0a3254' }}>
          <IconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{
              marginRight: 5,
              ...(drawerOpen && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs>
                {UserNamestate}
              </Grid>
             

              <Grid item xs>
                {Companynamestate}
              </Grid>

              <Grid item xs>
                {WareHouseNamestate}
              </Grid>

            </Grid>

          </Typography>
          <Stack spacing={2} direction="row">
            <Button color="inherit" variant="outlined" onClick={flogout}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer variant="permanent" open={drawerOpen}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>

          <Divider />
          
          <ListItems />
        </Drawer>
      </nav>
    </Box>
  )
};
