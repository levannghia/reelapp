import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling';
import { useIsFocused } from '@react-navigation/native';

interface VideoItemProps {
  item: any;
  isVisible: boolean,
  preload: boolean
}

const VideoItem:FC<VideoItemProps> = ({item, isVisible, preload}) => {

  const [paused, setPaused] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    setIsPaused(!isVisible)
    if(!isVisible) {
      setPaused(null);
      setVideoLoaded(false);
    }
  }, [isVisible])

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>

      </View>
    </View>
  )
}

export default VideoItem

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
    flexGrow: 1,
    flex: 1,
  },
  videoContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    height: screenHeight,
    aspectRatio: 9 / 16,
    flex: 1,
    zIndex: -1
  }
})