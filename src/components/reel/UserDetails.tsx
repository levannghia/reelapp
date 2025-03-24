import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import CustomText from '../global/CustomText'
import { FONTS } from '../../constants/Fonts'
import { useAuthStore } from '../../state/userStore'
import { Colors } from '../../constants/Colors'
import { useFollowingStore } from '../../state/followingStore'
import { toggleFollow } from '../../services/userAPI'
import { navigate, push } from '../../utils/NavigationUtil'

interface UserDetailsProps {
  user: any
}

const UserDetails: FC<UserDetailsProps> = ({ user }) => {
  const followingUser = useFollowingStore(state => state.following);
  const loggedInUser = useAuthStore(state => state.user);
  const isFollowing = useMemo(() => {
    return (
      followingUser?.find((item: any) =>
        item.id === user._id)?.isFollowing ?? user?.isFollowing
    )
  }, [followingUser, user._id, user.isFollowing]);

  const handleFollow = async () => {
    await toggleFollow(user._id);
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.flexRow}
        onPress={() => {
          push('UserProfileScreen', {
            username: user.username,
          })
        }}
      >
        <FastImage source={{ uri: user?.userImage, priority: FastImage.priority.high }} style={styles.img} resizeMode='cover' />
        <CustomText variant='h7' fontFamily={FONTS.Medium}>
          {user?.username}
        </CustomText>
        {loggedInUser?._id !== user._id && (
          <TouchableOpacity
            onPress={handleFollow}
            style={[
              styles.follow,
              {
                backgroundColor: isFollowing ? 'transparent' : Colors.white,
                borderWidth: isFollowing ? 1 : 0,
                borderColor: isFollowing ? Colors.disabled : Colors.white,
              }
            ]}
          >
            <CustomText
              variant='h7'
              fontFamily={FONTS.Medium}
              style={{ color: isFollowing ? 'white' : 'black' }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </CustomText>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default UserDetails

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  img: {
    height: 35,
    width: 35,
    borderRadius: 100,
  },
  follow: {
    borderWidth: 1,
    borderColor: Colors.text,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 50,

  }
})