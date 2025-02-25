import { appAxios } from "../constants/apiConfig";
import { useLikeStore } from "../state/likeStore";
import { useAuthStore } from "../state/userStore";

interface ReelStore {
    createReel: (data: any) => void;
}

const {refetchUser} = useAuthStore.getState();
const {addLikedReel} = useLikeStore.getState();

export const createReel = async (data: any) => {
    try {
        const res = await appAxios.post('/reel', data);
        await refetchUser();
    } catch (error) {
        console.log("create reel error ==> ", error);
        
    }
} 

export const toggleLikeReel = async (id: string, likesCount: number) => {
    try {
        const res = await appAxios.post(`/like/reel/${id}`);
        
        const isLiked = res.data.msg !== 'Unliked';
        const newLikesCount = isLiked ? likesCount + 1 : likesCount - 1;
        
        addLikedReel({
            id,
            isLiked,
            likesCount: newLikesCount
        });
        
        return {
            success: true,
            isLiked,
            likesCount: newLikesCount
        };
    } catch (error) {
        console.log('LIKE REEL', error);
    }
}