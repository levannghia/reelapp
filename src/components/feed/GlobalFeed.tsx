import { FlatList, ImageBackground, StyleSheet, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import GlobalBg from '../../assets/images/globebg.jpg';
import { screenHeight, screenWidth } from '../../utils/Scaling';
import { useReelStore } from '../../state/reelStore';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { navigate } from '../../utils/NavigationUtil';
import ReelItemCard from './ReelItemCard';

const GlobalFeed: FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const { fetchFeedReel } = useReelStore.getState();
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const zoomScale = useSharedValue(1);
  const zoomStartScale = useSharedValue(0);

  const fetchFeed = async () => {
    setLoading(true);
    const data = await fetchFeedReel(0, 16);
    console.log(data);

    setData(data);
    setLoading(false)
  }

  useEffect(() => {
    fetchFeed();
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: zoomScale.value },
        {
          translateX: translateX.value,
        },
        { translateY: translateY.value },
      ],
    };
  });

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const verticalShift = index % 2 === 0 ? -20 : 20;
    return (
      <Animated.View style={{ transform: [{ translateY: verticalShift }] }}>
        <ReelItemCard
          item={item}
          loading={loading}
          onPressReel={async () => {
            // const copyarray = Array.from(data);
            // const result = await moveToFirst(copyarray, index);
            // navigate('FeedReelScrollScreen', {
            //   data: result,
            // });
          }}
        />
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={GlobalBg}
      style={{ flex: 1, zIndex: -1 }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.gridContainer}>
          {loading ? (
            <FlatList
              data={Array.from({ length: 16 })}
              contentContainerStyle={styles.flatListContainer}
              scrollEnabled={false}
              pinchGestureEnabled
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          ) : (
            <FlatList
              data={data}
              contentContainerStyle={styles.flatListContainer}
              scrollEnabled={false}
              pinchGestureEnabled
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
      </Animated.View>
    </ImageBackground>
  )
}

export default GlobalFeed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  gridContainer: {
    width: screenWidth * 5,
    height: screenHeight * 2.9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatListContainer: {

  }
})