interface User {
    _id: string;
    id: string;
    username: string;
    userImage: string;
    name: string;
    followersCount: string;
    followingCount: number;
    reelsCount: number;
    isFollowing?: boolean;
    bio: string;
  }