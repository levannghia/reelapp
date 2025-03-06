import { appAxios } from "../constants/apiConfig"

export const getComments = async (reelId: string, offset: number) => {
    try {
        const res = await appAxios.get(`/comment?reelId=${reelId}&limit=5&offset${offset}`);
        return res.data || [];
    } catch (error) {
        console.log('GET COMMENTS ERROR', error);
        return [];
    }
}