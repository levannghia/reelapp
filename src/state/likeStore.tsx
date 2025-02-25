import { create } from 'zustand';
import { appAxios } from '../constants/apiConfig';

interface LikedItem {
    id: string;
    isLiked: boolean;
    likesCount: number;
}

interface LikeState {
    LikedReel: LikedItem[];
    LikedComment: LikedItem[];
    LikedReply: LikedItem[];
    addLikedReel: (item: LikedItem) => void;
    addLikedComment: (item: LikedItem) => void;
    addLikedReply: (item: LikedItem) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
    LikedReel: [],
    LikedComment: [],
    LikedReply: [],

    addLikedReel: (item) =>
        set((state) => {
            const index = state.LikedReel.findIndex((el) => el.id === item.id);
            if (index !== -1) {
                const updatedReels = [...state.LikedReel];
                updatedReels[index] = item;
                return { LikedReel: updatedReels };
            }
            
            // Nếu không, thêm item mới
            return { LikedReel: [...state.LikedReel, item] };
        }),

    addLikedComment: (item) =>
        set((state) => {
            const index = state.LikedComment.findIndex((el) => el.id === item.id);
            return {
                LikedComment: index !== -1
                    ? state.LikedComment.map((el, i) => (i === index ? item : el))
                    : [...state.LikedComment, item],
            };
        }),

    addLikedReply: (item) =>
        set((state) => {
            const index = state.LikedReply.findIndex((el) => el.id === item.id);
            return {
                LikedReply: index !== -1
                    ? state.LikedReply.map((el, i) => (i === index ? item : el))
                    : [...state.LikedReply, item],
            };
        }),
}));
