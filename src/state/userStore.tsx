import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mmkvStorage, tokenStorage } from './storage'
import { appAxios } from '../constants/apiConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { CHECK_USERNAME, LOGIN } from '../constants/API';
import { navigate, resetAndNavigate } from '../utils/NavigationUtil';
import { Alert } from 'react-native';

interface userState {
    user: null | Record<string, any>;
    setUser: (data: any) => void;
    refetchUserLogin: () => void;
    checkUserNameAvailability: (username: string) => void;
    signInWithGoogle: () => void;
}

interface RegisterData {
    id_token: string;
    provider: string;
    name: string;
    email: string;
    userImage: string;
}

const handleSignInSuccess = async (res: any) => {
    tokenStorage.set('access_token', res.data.tokens.access_token);
    tokenStorage.set('refresh_token', res.data.tokens.refresh_token);
}

const handleSignInError = (error: any, data: RegisterData) => {
    console.log("Loi", error);
    if (error.response.status == 401) {
        navigate('RegisterScreen', {
            ...data,
        });
        return;
    }
    Alert.alert('We are facing issues, try again later');
};

export const useAuthStore = create((
    persist<userState>(
        (set, get) => ({
            user: null,
            setUser: (value: Record<string, any> | null) => set(() => ({ user: value })),
            refetchUserLogin: async () => {
                try {
                    const res = await appAxios.get('/user/profile');
                    set({ user: res.data.user })
                } catch (error) {
                    console.log('REFETCH USER --> ', error);

                }
            },
            checkUserNameAvailability: async (username: string) => {
                try {
                    const res = await axios.post(CHECK_USERNAME, {
                        username
                    });
                
                    return res.data.available;
                } catch (error: any) {
                    // console.log(error);
                    return null;
                }
            },
            signInWithGoogle: async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    await GoogleSignin.signOut();
                    const { idToken, user } = await GoogleSignin.signIn();
                    await axios.post(LOGIN, {
                        provider: 'google',
                        id_token: idToken
                    }).then(async (res) => {
                        await handleSignInSuccess(res);
                        set({ user: res.data.user });
                        resetAndNavigate('BottomTab');
                    }).catch((err: any) => {
                        const errorData = {
                            email: user.email,
                            name: user.name,
                            userImage: user.photo,
                            provider: 'google',
                            id_token: idToken
                        }
                        handleSignInError(err, errorData as RegisterData);
                    })
                } catch (err) {
                    console.log('Google Error --> ', err);
                }
            }
        }),
        {
            name: 'user-store', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => mmkvStorage), // (optional) by default, 'localStorage' is used
        },
    )
))