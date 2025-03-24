import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '../global/CustomText';
import {FONTS} from '../../constants/Fonts';
import {Colors} from '../../constants/Colors';
import {navigate, push} from '../../utils/NavigationUtil';
import { useAuthStore } from '../../state/userStore';
import { useFollowingStore } from '../../state/followingStore';
import { toggleFollow } from '../../services/userAPI';

const AvatarComponent: React.FC<{uri: string}> = ({uri}) => {
  return <Image source={{uri}} style={styles.avatar} />;
};

const StatsComponent: React.FC<{
  count: string | number;
  label: string;
  onPress?: () => void;
}> = ({count, label, onPress}) => {
  return (
    <TouchableOpacity style={styles.statsItem} onPress={onPress}>
      <CustomText variant="h6" fontFamily={FONTS.Medium}>
        {count}
      </CustomText>
      <CustomText variant="h6">{label}</CustomText>
    </TouchableOpacity>
  );
};

const UserProfileDetails: React.FC<{
  user: any;
  refetchLoginUser: () => void;
}> = ({user, refetchLoginUser}) => {
  const loggedInUser = useAuthStore(state => state.user);
  const followingUsers = useFollowingStore(state => state.following);
  const handleFollow = async () => {
    const data = await toggleFollow(user?.id);
    refetchLoginUser();
  };
  const isFollowing = useMemo(() => {
    return (
      followingUsers?.find((item: any) => item.id === user.id)?.isFollowing ??
      user.isFollowing
    );
  }, [followingUsers, user.id, user.isFollowing]);

  const handleShareProfile = () => {
    const profileUrl = `${
      Platform.OS === 'android' ? 'http://localhost:3000' : 'reelzzz:/'
    }/share/user/${user.username}`;
    const message = `Hey, Checkout this profile: ${profileUrl}`;
    Share.share({
      message: message,
    })
      .then(res => {
        console.log('Share Result', res);
      })
      .catch(error => {
        console.log('Share Error', error);
      });
  };

  return (
    <View style={{backgroundColor: Colors.background}}>
      <View style={styles.flexRowBetween}>
        <AvatarComponent uri={user?.userImage} />
        <View style={styles.statsContainer}>
          <View style={styles.statsBtn}>
            <StatsComponent
              onPress={() =>
                push('FollowingScreen', {
                  userId: user?.id,
                  type: 'Followers',
                })
              }
              count={user?.followersCount}
              label="Followers"
            />
            <StatsComponent count={user?.reelsCount} label="Reels" />
            <StatsComponent
              onPress={() =>
                push('FollowingScreen', {
                  userId: user?.id,
                  type: 'Following',
                })
              }
              count={user?.followingCount}
              label="Following"
            />
          </View>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <CustomText variant="h6" fontFamily={FONTS.Medium}>
          {user?.name}
        </CustomText>
        <CustomText
          variant="h6"
          style={styles.bio}
          fontFamily={FONTS.Medium}
          numberOfLines={5}>
          {user?.bio}
        </CustomText>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                loggedInUser?.id == user?.id || isFollowing
                  ? '#1c1b1b'
                  : Colors.fbColor,
            },
          ]}
          onPress={
            loggedInUser?.id == user?.id
              ? () => {
                  //go to edit profile screen
                }
              : () => handleFollow()
          }>
          <CustomText variant="h7" fontFamily={FONTS.Medium}>
            {loggedInUser?.id == user?.id
              ? 'Edit Profile'
              : isFollowing
              ? 'Unfollow'
              : 'Follow'}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={handleShareProfile}>
          <CustomText variant="h7" fontFamily={FONTS.Medium}>
            Share Profile
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  btn: {
    backgroundColor: '#1c1b1b',
    padding: 8,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: RFValue(80),
    height: RFValue(80),
    borderRadius: 105,
  },
  statsContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    top: 6,
  },
  statsBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statsItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  bioContainer: {
    margin: 10,
    width: '70%',
  },
  bio: {
    color: Colors.lightText,
    marginTop: 5,
    lineHeight: 18,
  },
});

export default UserProfileDetails;
