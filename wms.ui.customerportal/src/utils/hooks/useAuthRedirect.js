import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAuthenticated } from '../authUtil';
import { LOGIN_ROUTE } from '../../Pages/routes';


const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(LOGIN_ROUTE);
    }
  }, [navigate]);
};

export default useAuthRedirect;
