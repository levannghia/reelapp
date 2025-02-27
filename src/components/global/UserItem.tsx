import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useMemo } from 'react'
import FastImage from 'react-native-fast-image';
import CustomText from './CustomText';
import { FONTS } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import { useAuthStore } from '../../state/userStore';
import { useFollowingStore } from '../../state/followingStore';
import { RFValue } from 'react-native-responsive-fontsize';
import { toggleFollow } from '../../services/userAPI';

const UserItem: FC<{ user: User; onPress?: () => void }> = ({ user, onPress }) => {
  const me = useAuthStore(state => state.user);
  const followingUsers = useFollowingStore(state => state.following);
  const isFollowing = useMemo(() => {
    return (
      followingUsers?.find((item: any) => item.id === user._id)?.isFollowing ?? user.isFollowing
    )
  }, [user._id, followingUsers, user.isFollowing])

  const handleFollow = async () => {
    try {
      await toggleFollow(user._id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => { }}
    >
      <FastImage
        source={{ uri: user.userImage, priority: FastImage.priority.high }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <CustomText variant='h7' fontFamily={FONTS.Medium}>
          {user.name}
        </CustomText>
        <CustomText
          variant='h7'
          fontFamily={FONTS.Medium}
          style={{ color: Colors.lightText }}
        >
          @{user?.username}
        </CustomText>
      </View>
      {user._id != me?.id &&
        <TouchableOpacity
          onPress={handleFollow}
          style={[
            styles.followButton,
            {
              backgroundColor: isFollowing ? 'transparent' : 'white',
              borderWidth: isFollowing ? 1 : 0,
              borderColor: Colors.text,
            },
          ]}
        >
          <CustomText
            variant='h7'
            style={[
              styles.followButtonText,
              {
                color: isFollowing ? Colors.text : Colors.border,
              },
            ]}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </CustomText>
        </TouchableOpacity>
      }
    </TouchableOpacity>
  )
}

export default UserItem

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center'
  },
  avatar: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  handler: {
    fontSize: RFValue(14),
    color: Colors.text,
  },
  followButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  followButtonText: {
    color: Colors.border,
  },
})