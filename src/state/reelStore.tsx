import { create } from "zustand";
import { appAxios } from "../constants/apiConfig";
import { useAuthStore } from "./userStore";

interface ReelStore {
    createReel: (data: any) => void;
    fetchFeedReel: (offset: number, limit: number) => void
}

const {refetchUser} = useAuthStore.getState();

export const useReelStore = create<ReelStore>((set) => ({
    createReel: async (data: any) => {
        try {
            const res = await appAxios.post('/reel', data);
            await refetchUser();
        } catch (error) {
            console.log("create reel error ==> ", error);
            
        }
    },
    fetchFeedReel: async (offset: number, limit: number) => {
        try {
            const res = await appAxios.get(`/feed/home?limit=${limit || 25}&offset=${offset}`);
            return res.data.reels || [];
        } catch (error) {
            console.log("fetch feed error ==> ", error);
            return [];
        }
    }
}))