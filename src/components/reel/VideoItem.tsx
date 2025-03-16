import { StyleSheet, Text, View } from 'react-native'
import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Loader from '../../assets/images/loader.jpg';
import Video from 'react-native-video';
import ConvertToProxyURL from 'react-native-video-cache';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import DoubleTapAnim from '../../assets/animations/heart.json';
import ReelItem from './ReelItem';
import { toggleLikeReel } from '../../services/reelAPI';
import { useLikeStore } from '../../state/likeStore';
import { SheetManager } from 'react-native-actions-sheet';
import { useCommentStore } from '../../state/commentStore';

interface VideoItemProps {
  item: any;
  isVisible: boolean,
  preload: boolean
}

const VideoItem: FC<VideoItemProps> = ({ item, isVisible, preload }) => {

  const itemRef = useRef(item);
  const videoRef = useRef(null);

  const likedReels = useLikeStore(state => state.LikedReel);
  const commentsCount = useCommentStore(state => state.comments);
  const [paused, setPaused] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [showLikeAnim, setShowLikeAnim] = useState<boolean>(false);

  const isFocused = useIsFocused();

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const reelMeta = useMemo(() => {
    return {
      isLiked: likedReels?.find((ritem: any) => ritem.id === item._id)?.isLiked ?? item?.isLiked,
      likesCount: likedReels?.find((ritem: any) => ritem.id === item._id)?.likesCount ?? item?.likesCount,
    }
  }, [likedReels, item?._id])

  const commentMeta = useMemo(() => {
    return (
      commentsCount?.find((ritem: any) => ritem.reelId === item._id)?.commentsCount?? item?.commentsCount
    )
  }, [commentsCount, item?._id])

  const handleLikeReel = useCallback(async () => {
    await toggleLikeReel(item._id, reelMeta?.likesCount);
  }, [item._id, reelMeta.likesCount])

  const handleTogglePlay = useCallback(() => {
    let currentState = !paused ? 'paused' : 'play';
    setIsPaused(!isPaused);
    setPaused(currentState);
    setTimeout(() => {
      if (currentState === 'play') setPaused(null);
    }, 700);
  }, [paused, isPaused]);

  const handleDoubleTapLike = useCallback(() => {
    setShowLikeAnim(true);
    if (!reelMeta?.isLiked) {
      handleLikeReel();
    }
    setTimeout(() => {
      setShowLikeAnim(false);
    }, 1200);
  }, [reelMeta.isLiked, handleLikeReel]);

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      handleTogglePlay();
    })
    .runOnJS(true);
  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      handleDoubleTapLike();
    })
    .runOnJS(true);

  useEffect(() => {
    setIsPaused(!isVisible)
    if (!isVisible) {
      setPaused(null);
      setVideoLoaded(false);
    }
  }, [isVisible])

  useEffect(() => {
    if (!isFocused) {
      if (!isFocused) {
        setIsPaused(true);
      }

      if (isFocused && isVisible) {
        setIsPaused(false);
      }
    }
  }, [isFocused, isVisible])

  const videoProps = useMemo(() => ({
    poster: item?.thumbUri,
    posterResizeMode: 'cover',
    source: (isVisible || preload) ? { uri: ConvertToProxyURL(item?.videoUri) } : undefined,
    bufferConfig: {
      maxBufferMs: 3000,
      minBufferMs: 2500,
      bufferForPlaybackMs: 2500,
      bufferForPlaybackAfterRebufferMs: 2500
    },
    ignoreSilentSwitch: 'ignore',
    playWhenInactive: false,
    playInBackground: false,
    useTextureView: false,
    controls: false,
    disableFocus: false,
    style: styles.videoContainer,
    paused: isPaused,
    repeat: true,
    hideShutterView: true,
    minLoadRetryCount: 5,
    resizeMode: "cover",
    shutterColor: "transparent",
    onReadyForDisplay: handleVideoLoad
  }), [item?.thumbUri, item?.videoUri, isVisible, preload, isPaused, handleVideoLoad]);

  const handleReelLike = useCallback(() => {
    handleLikeReel();
  }, [handleLikeReel]);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
          <View style={styles.videoContainer}>
            {!videoLoaded && (
              <FastImage
                source={{ uri: item.thumbUri, priority: FastImage.priority.high }}
                resizeMode='cover'
                defaultSource={Loader}
                style={styles.videoContainer}
              />
            )}

            {isVisible || preload ? (
              <Video
                ref={videoRef}
                poster={item.thumbUri}
                posterResizeMode="cover"
                source={
                  isVisible || preload
                    ? { uri: ConvertToProxyURL(item.videoUri) }
                    : undefined
                }
                bufferConfig={{
                  minBufferMs: 2500,
                  maxBufferMs: 3000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 2500,
                }}
                ignoreSilentSwitch={'ignore'}
                playWhenInactive={false}
                playInBackground={false}
                useTextureView={false}
                controls={false}
                disableFocus={true}
                style={styles.videoContainer}
                paused={isPaused}
                repeat={true}
                hideShutterView
                minLoadRetryCount={5}
                resizeMode="cover"
                shutterColor="transparent"
                onReadyForDisplay={handleVideoLoad}
              />
            ) : null}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>

      {showLikeAnim && (
        <View style={styles.lottieContainer}>
          <LottieView
            style={styles.lottie}
            source={DoubleTapAnim}
            autoPlay
            loop={false}
          />
        </View>
      )}

      {paused !== null && (
        <View style={styles.playPauseButton}>
          <View style={styles.shadow} pointerEvents="none">
            <Icon
              name={paused === 'paused' ? 'pause' : 'play-arrow'}
              size={50}
              color="white"
            />
          </View>
        </View>
      )}

      <ReelItem
        user={item?.user}
        description={item?.caption}
        likes={reelMeta?.likesCount || 0}
        comments={commentMeta}
        isLiked={reelMeta?.isLiked}
        onComment={() => {
          SheetManager.show('comment-sheet', {
            payload: {
              id: item?._id,
              user: item?.user,
              commentsCount: item?.commentsCount
            }
          })
        }}
        onLike={handleReelLike}
        onLongPressLike={() => {
          SheetManager.show('like-sheet', {
            payload: {
              entityId: item?._id,
              type: 'reel',
            },
          })
        }}
        onShare={() => { }}
      />
    </View>
  )
}

const areEqual = (prevProps: VideoItemProps, nextProps: VideoItemProps) => {
  return (
    prevProps?.item?._id === nextProps?.item?._id &&
    prevProps?.isVisible === nextProps?.isVisible

  )
}

export default memo(VideoItem, areEqual)

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
  },
  playPauseButton: {
    position: 'absolute',
    top: '47%',
    bottom: 0,
    left: '44%',
    opacity: 0.7,
  },
  shadow: {
    zIndex: -1,
  },
  lottieContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
})