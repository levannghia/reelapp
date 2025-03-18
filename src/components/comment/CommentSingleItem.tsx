import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useRef } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SheetManager } from 'react-native-actions-sheet';
import { navigate } from '../../utils/NavigationUtil';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { getRelativeTime } from '../../utils/DateUtils';
import FastImage from 'react-native-fast-image';
import GIFLoader from '../../assets/animations/giphy.gif';

interface CommentSingleItemProps {
    isReply?: boolean;
    scrollToComment: () => void;
    comment: Comment | SubReply;
    user: User | undefined;
    onReply: (comment: Comment | SubReply) => void;
}

const CommentSingleItem: FC<CommentSingleItemProps> = ({
    isReply,
    scrollToComment,
    comment,
    user,
    onReply,
}) => {

    const backgroundColor = useRef(new Animated.Value(0)).current;
    const startAnimation = () => {
        Animated.sequence([
            Animated.timing(backgroundColor, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColor, {
                toValue: 0,
                duration: 4000,
                useNativeDriver: false,
            }),
        ]).start();
    };
    const handleReply = () => {
        scrollToComment();
        startAnimation();
        onReply(comment);
    };

    useEffect(() => {
        if (comment?.isPosting) {
            scrollToComment();
            startAnimation();
        }
    }, [comment?.isPosting]);

    const doubleTap = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart(() => {
            //   likeComment();
        })
        .runOnJS(true);

    const multiAction = async () => {
        'worklet';
    };

    const longPress = Gesture.LongPress()
        .minDuration(750)
        .onStart(() => {
            multiAction();
        })
        .runOnJS(true);

    const backgroundColorInterpolate = backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', Colors.black],
    });
    return (
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, longPress)}>
            <Animated.View
                style={[
                    styles.commentContainer,
                    { backgroundColor: backgroundColorInterpolate },
                ]}
            >
                <TouchableOpacity
                    onPress={() => {
                        SheetManager.hide('comment-sheet');
                        navigate('UserProfileScreen', {
                            username: comment?.user?.username,
                        });
                    }}>
                    <Image
                        source={{ uri: comment?.user?.userImage }}
                        style={styles.userImage}
                    />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <View style={styles.flexRow}>
                        <CustomText
                            fontFamily={FONTS.SemiBold}
                            variant="h7"
                            style={styles.username}>
                            {comment?.user?.username}
                        </CustomText>
                        <CustomText
                            variant="h7"
                            fontFamily={FONTS.Medium}
                            style={styles.timestamp}>
                            {getRelativeTime(comment.timestamp)}
                        </CustomText>
                        {comment?.isPinned && (
                            <Icon
                                name="pin"
                                size={RFValue(10)}
                                color="#888"
                                style={{ transform: [{ rotate: '45deg' }] }}
                            />
                        )}
                        {comment?.user?._id == user?._id && (
                            <CustomText
                                variant="h7"
                                style={styles.timestamp}
                                fontFamily={FONTS.Medium}>
                                • Author{' '}
                            </CustomText>
                        )}
                        {comment?.isLikedByAuthor && (
                            <>
                                <CustomText
                                    variant="h7"
                                    style={styles.timestamp}
                                    fontFamily={FONTS.Medium}>
                                    •
                                </CustomText>
                                <Icon name="heart" size={RFValue(10)} color="red" />
                                <CustomText
                                    variant="h7"
                                    style={styles.timestamp}
                                    fontFamily={FONTS.Medium}>
                                    by author{' '}
                                </CustomText>
                            </>
                        )}
                    </View>
                    <CustomText style={styles.commentText} variant="h7">
                        {isReply ? comment?.reply : comment?.comment}
                    </CustomText>
                    {comment?.hasGif && (
                        <FastImage
                            source={{
                                uri: comment?.gifUrl,
                                priority: FastImage.priority.high,
                            }}
                            defaultSource={GIFLoader}
                            style={styles.gifImage}
                            resizeMode="cover"
                        />
                    )}
                </View>

            </Animated.View>
        </GestureDetector>
    )
}

export default CommentSingleItem

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 6,
    },
    button: {
        position: 'absolute',
        right: 15,
        alignItems: 'center',
        justifyContent: 'center',
        top: 12,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    username: {},
    commentText: {
        marginVertical: 3,
    },
    timestamp: {
        color: Colors.lightText,
    },
    gifImage: {
        width: RFValue(170),
        height: RFValue(100),
        marginBottom: 5,
        aspectRatio: 4 / 3,
        borderRadius: 10,
    },
});