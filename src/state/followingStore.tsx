import { create } from "zustand";


interface FollowingUser {
  id: string;
  isFollowing: boolean;
}

interface FollowingState {
  following: FollowingUser[];
  addFollowing: (newUser: FollowingUser) => void;
}

export const useFollowingStore = create<FollowingState>((set) => ({
  following: [],
  addFollowing: (newUser) =>
    set((state) => {
      const index = state.following.findIndex(user => user.id === newUser.id);
      if (index !== -1) {
        // Cập nhật người dùng nếu đã tồn tại trong danh sách
        return {
          following: state.following.map((user, i) => 
            i === index ? newUser : user
          )
        };
      } else {
        // Thêm người dùng mới vào danh sách nếu chưa tồn tại
        return {
          following: [...state.following, newUser]
        };
      }
    }),
}));
