import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { FC } from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling';
import ReelCardLoader from '../loader/ReelCardLoader';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';

interface ProfileReelCardProps {
    style?: ViewStyle;
    onPressReel: () => void;
    loading: boolean;
    item: any;
}

const ProfileReelCard: FC<ProfileReelCardProps> = ({ style, onPressReel, loading, item }) => {
    return (
        <View style={[styles.card, style]}>
            {loading ? <ReelCardLoader style={styles.skeletonLoader} /> : (
                <TouchableOpacity
                    onPress={onPressReel}
                    style={styles.cardContent}
                >
                    <FastImage
                        source={{
                            uri: item?.thumbUri,
                            priority: FastImage.priority.high,
                        }}
                        style={styles.img}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={styles.views}>
                        <Icon name="play" size={RFValue(10)} color={Colors.white} />
                        <CustomText variant="h7" fontFamily={FONTS.SemiBold}>
                            {item?.viewCount}
                        </CustomText>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default ProfileReelCard

const styles = StyleSheet.create({
    img: {
        width: screenWidth * 0.28,
        height: screenHeight * 0.25,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    views: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.02)',
        bottom: 3,
        right: 3,
        gap: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    card: {
        width: screenWidth * 0.28,
        height: screenHeight * 0.25,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardContent: {},
    skeletonLoader: {
        width: '100%',
        height: '100%',
    },
})