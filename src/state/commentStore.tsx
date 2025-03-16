import { create } from "zustand";


interface LikedComment {
  reelId: string;
  commentsCount: number;
}

interface CommentState {
  comments: LikedComment[];
  addComment: (newComment: any) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  addComment: (newComment) =>
    set((state) => {
      const index = state.comments.findIndex(item => item.reelId === newComment.reelId);
      if (index !== -1) {
        // Update existing comment
        const newComments = [...state.comments];
        newComments[index] = newComment;
        return { comments: newComments };
      }
      // Add new comment
      return { comments: [...state.comments, newComment] };
    }),
}));
