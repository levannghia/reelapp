import { create } from "zustand";
import { appAxios } from "../constants/apiConfig";
import { useAuthStore } from "./userStore";

interface ReelStore {
    createReel: (data: any) => void;
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
    } 
}))