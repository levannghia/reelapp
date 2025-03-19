import { appAxios } from "../constants/apiConfig";
import { useLikeStore } from "../state/likeStore";

const { addLikedComment, addLikedReply } = useLikeStore.getState();

export const toggleLikeComment = async (id: string, likesCount: number, isLiked: boolean) => {
    const data = {
        id: id,
        isLiked: !isLiked,
        likesCount: isLiked ? likesCount - 1 : likesCount + 1,
    };
    addLikedComment(data);
    try {
        const res = await appAxios.post(`/like/comment/${id}`);
    } catch (error: any) {
        const data = {
            id: id,
            isLiked: isLiked,
            likesCount: isLiked ? likesCount + 1 : likesCount - 1,
        };
        addLikedComment(data);
        console.log('LIKE COMMENT ->', error);
    }
};

export const toggleLikeReply = async (id: string, likesCount: number, isLiked: boolean) => {
    const data = {
        id: id,
        isLiked: !isLiked,
        likesCount: isLiked ? likesCount - 1 : likesCount + 1,
    };
    addLikedReply(data);
    try {
        const res = await appAxios.post(`/like/reply/${id}`);
    } catch (error: any) {
        const data = {
            id: id,
            isLiked: isLiked,
            likesCount: isLiked ? likesCount + 1 : likesCount - 1,
        };
        addLikedReply(data);
        console.log('LIKE REEL ->', error);
    }
};