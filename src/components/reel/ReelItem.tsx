import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import CustomText from '../global/CustomText';
import UserDetails from './UserDetails';
import InteractionButtons from './InteractionButtons';

interface ReelItemProps {
    user: any;
    description: string;
    likes: number;
    comments: number;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    onLongPressLike: () => void;
    isLiked: boolean;
}

const ReelItem: FC<ReelItemProps> = ({
    user,
    description,
    likes,
    comments,
    onLike,
    onComment,
    onShare,
    onLongPressLike,
    isLiked
}) => {
    return (
        <View style={styles.interactionContainer}>
            <View style={styles.userContainer}>
                <UserDetails user={user} />
                <CustomText variant='h7' numberOfLines={2}>
                    {description}
                </CustomText>
            </View>
            <InteractionButtons
                likes={likes}
                onLongPressLike={onLongPressLike}
                comments={comments}
                onLike={onLike}
                onComment={onComment}
                onShare={onShare}
                isLiked={isLiked}
            />
        </View>
    )
}

export default ReelItem

const styles = StyleSheet.create({
    interactionContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 20 : 10,
        width: '100%',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userContainer: {
        width: '70%',
        justifyContent: 'flex-end',
    }
})