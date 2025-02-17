import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { FC } from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling'
import { Colors } from '../../constants/Colors'
import FastImage from 'react-native-fast-image'
import ReelCardLoader from '../loader/ReelCardLoader'

interface ReelItemCardProps {
    style?: ViewStyle,
    loading: boolean,
    item: any,
    onPressReel: () => void
}

const ReelItemCard: FC<ReelItemCardProps> = ({style, loading, item, onPressReel}) => {
  return (
    <View style={[styles.card, style]}>
      {loading ? <ReelCardLoader/> : (
        <TouchableOpacity onPress={onPressReel}>
            <FastImage
                style={styles.img}
                source={{
                    uri: item?.thumbUri,
                    priority: FastImage.priority.high
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ReelItemCard

const styles = StyleSheet.create({
    card: {
        width: screenWidth * 0.35,
        height: screenHeight * 0.25,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        borderWidth: 0.8,
        borderColor: Colors.border,
        overflow: 'hidden'
    },
    img: {
        width: screenWidth * 0.35,
        height: screenHeight * 0.25,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeltonLoader: {
        width: '100%',
        height: '100%'
    }
})