import axios from "axios";
import { Alert } from "react-native"
import { REGISTER, UPLOAD } from "../constants/API";
import Toast from 'react-native-toast-message'
import { tokenStorage } from "../state/storage";
import { useAuthStore } from "../state/userStore";
import { resetAndNavigate } from "../utils/NavigationUtil";
import { appAxios } from "../constants/apiConfig";
import { useFollowingStore } from "../state/followingStore";

interface RegisterData {
    id_token: string;
    provider: string;
    name: string;
    email: string;
    userImage: string;
}

export const uploadFile = async (localUrl: string, mediaType: string) => {
    try {
        const formData = new FormData();
        formData.append('image', {
            uri: localUrl,
            name: 'file',
            type: 'video/mp4',
        } as any)
        formData.append('mediaType', mediaType);

        const res = await axios.post(UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // 'Accept': 'application/json'
            },
            // transformRequest: (data, headers) => {
            //     // !!! override data to return formData
            //     // since axios converts that to string
            //     return formData;
            // },
        })

        return res.data.mediaUrl;
    } catch (error) {
        let errorMessage = 'Upload Error';

        if (axios.isAxiosError(error)) {
            if (error.message === 'Network Error') {
                errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
            } else {
                errorMessage = `Lỗi tải lên: ${error.message}`;
            }
        }

        Alert.alert('Thông báo', errorMessage);
        console.log(`upload error: ${UPLOAD}`, error);
        return null;
    }
}

export const register = async (data: RegisterData) => {
    try {
        const { setUser } = useAuthStore.getState();
        const res = await axios.post(REGISTER, data);
        tokenStorage.set('access_token', res.data.tokens.access_token);
        tokenStorage.set('refresh_token', res.data.tokens.refresh_token);
        setUser(res.data.user);
        resetAndNavigate('BottomTab');
    } catch (error: any) {
        Toast.show({
            type: 'error',
            props: {
                msg: 'There was an error, try again later',
            },
        })
        console.log('REGISTER ERROR ->', error);
    }
}

export const toggleFollow = async (userId: string) => {
    const { addFollowing } = useFollowingStore.getState();
    const { refetchUser } = useAuthStore();

    try {
        const res = await appAxios.put(`/user/follow/${userId}`);
        const data = {
            id: userId,
            isFollowing: res.data.msg == 'Unfollowed' ? false : true
        }

        addFollowing(data);
        refetchUser()
    } catch (error) {
        console.log('TOGGLE FOLLOW ERROR', error);

    }
}