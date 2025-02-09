import axios from 'axios';
import { BASE_URL, REFRESH_TOKEN } from './API';
import { tokenStorage } from '../state/storage';
import { resetAndNavigate } from '../utils/NavigationUtil';

export const appAxios = axios.create({
    baseURL: BASE_URL,
})

appAxios.interceptors.request.use(
    async config => {
        const accessToken = tokenStorage.getString('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
)

appAxios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config)
                }
            } catch (error) {
                console.log('Error Refreshing Token:', error);
            }
        }
    }
)

export const refreshToken = async () => {
    try {
        const refresh_token = tokenStorage.getString('refresh_token');
        const response = await axios.post(REFRESH_TOKEN, {
            refresh_token,
        });
        const new_access_token = response.data.access_token;
        const new_refresh_token = response.data.refresh_token;
        tokenStorage.set('access_token', new_access_token);
        tokenStorage.set('refresh_token', new_refresh_token);
        return new_access_token;
    } catch (error) {
        console.log('REFRESH TOKEN ERROR');
        tokenStorage.clearAll();
        resetAndNavigate('LoginScreen');
    }
};
