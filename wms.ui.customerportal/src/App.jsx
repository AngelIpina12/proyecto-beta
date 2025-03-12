import { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Menu, YardSummary, TrailerFolioHistory, EventComp } from './components';
import { HOME_ROUTE, INVENTORY_ROUTE, LOGIN_ROUTE, RECEIVES_ROUTE, REQUIREMENTS_ROUTE, SHIPPING_ROUTE, YARD_SUMMARY_ROUTE, DASHBOARD_3PL_ROUTE, DASHBOARD_VIEW_ROUTE, DASHBOARD_SET_ROUTE, DASHBOARD_SETTINGS_ROUTE } from './Pages/routes';
import { useAuthRedirect } from './utils'
import { Login, Receives, Requirements, Inventory, ShippingSummary, DashboardSettings } from './Pages';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import { Box } from '@mui/material';
import { DashboardView } from './Pages/Dashboard/DashboardView';
import { DashboardSet } from './Pages/Dashboard/DashboardSet';
import { Dashboard3PL } from './Pages/Dashboard/Dashboard3PL';

function Layout({ children, drawerOpen, setDrawerOpen }) {
  useAuthRedirect();
  const location = useLocation();
  const drawerWidth = 240;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Cambiar a 'column' para que el contenido se alinee verticalmente
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Cambiar a 'row' para que el contenido se alinee horizontalmente
          flexGrow: 1,
          marginTop: '64px', // Ajustar el margen superior para que no quede detrás del menú superior
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: drawerOpen ? `${drawerWidth}px` : '72px', // Ajustar el margen izquierdo basado en el estado del drawer
            transition: 'margin-left 0.3s',
            padding: '0px', // Añadir padding para evitar que el contenido se vea compacto
            overflow: 'auto', // Añadir overflow para manejar contenido grande
          }}
        >
          {location.pathname !== LOGIN_ROUTE && <Menu drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />}
          {children}
        </Box>
      </Box>
    </Box>
  );

}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const theme = createTheme({
    typography: {
      "fontFamily": `Open Sans`,
    }
  });


  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
        <Layout drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} >
          <Routes>
            <Route path={HOME_ROUTE} exact element={<DashboardView />} />
            <Route path={LOGIN_ROUTE} exact element={<Login />} />
            <Route path={YARD_SUMMARY_ROUTE} element={<YardSummary />} >
              <Route path="TrailerFolioHistory/:id" element={<TrailerFolioHistory />} >
              </Route>
            </Route>
            <Route path={RECEIVES_ROUTE} element={<Receives />} />
            <Route path={REQUIREMENTS_ROUTE} element={<Requirements />} />
            <Route path="/EventComp" element={<EventComp />} />
            <Route path={INVENTORY_ROUTE} element={<Inventory />} />
            <Route path={SHIPPING_ROUTE} element={<ShippingSummary />} />
            <Route path={DASHBOARD_3PL_ROUTE} element={<Dashboard3PL />} />
            <Route path={DASHBOARD_VIEW_ROUTE} element={<DashboardView />} />
            <Route path={DASHBOARD_SET_ROUTE} element={<DashboardSet />} />
            <Route path={DASHBOARD_SETTINGS_ROUTE} element={<DashboardSettings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
