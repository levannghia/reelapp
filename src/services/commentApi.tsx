import { appAxios } from "../constants/apiConfig"
import { useCommentStore } from "../state/commentStore";

export const getComments = async (reelId: string, offset: number) => {
    try {
        const res = await appAxios.get(`/comment?reelId=${reelId}&limit=5&offset${offset}`);
        return res.data || [];
    } catch (error) {
        console.log('GET COMMENTS ERROR', error);
        return [];
    }
}

export const postComment = async (data: any, commentsCount: number) => {
    const {addComment} = useCommentStore.getState();
    try {
        const res = await appAxios.post(`/comment`, data);
        addComment({
            reelId: data.reelId,
            commentsCount: commentsCount + 1
        });
        return res.data;
    } catch (error) {
        console.log('POST COMMENT ERROR', error);
    }
}

export const getReplices = async (commentId: number | string, offset: number) => {
    try {
        const res = await appAxios.get(`/reply?commentId=${commentId}&offset=${offset}`);
        return res.data || [];
    } catch (error: any) {
        console.log('GET REPLIES ERROR', error);
        return [];
    }
}

export const postReply = async (data: any, commentsCount: number) => {
    const addComment = useCommentStore.getState().addComment;
    try {
        const res = await appAxios.post('/reply', data);
        addComment({
            reelId: data?.reelId,
            commentsCount: commentsCount + 1
        });

        return res.data;
    } catch (error) {
        console.log('POST REPLY ERROR', error);
        
    }
}