import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'userData';

export const isAuthenticated = () => {
	try {
		const token = localStorage.getItem(TOKEN_KEY);

		if (!token) {
			return false;
		}

		const decodedToken = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);
		
		if (decodedToken.exp < currentTime) {
			return false;
		}

		return true;

	} catch (error) {
		return false;
	}
};

const getTokenFromStorage = () => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        return token || null;
    } catch (error) {
        return null;
    }
};

export const getTokenInfo = () => {
    const token = getTokenFromStorage();
    return token ? jwtDecode(token) : null;
};

export const getToken = () => {
    return getTokenFromStorage();
};
