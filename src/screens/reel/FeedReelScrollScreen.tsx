import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import CustomText from '../../components/global/CustomText';
import { screenHeight, screenWidth } from '../../utils/Scaling';
import CustomView from '../../components/global/CustomView';
import { debounce } from 'lodash';
import { useReelStore } from '../../state/reelStore';
import { Colors } from '../../constants/Colors';
import { goBack } from '../../utils/NavigationUtil';
import Loader from '../../assets/images/loader.jpg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import VideoItem from '../../components/reel/VideoItem';

interface RouteProp {
  data: any[]
}

const FeedReelScrollScreen: FC = () => {
  const route = useRoute();
  const routeParams = route?.params as RouteProp;
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);
  const { fetchFeedReel } = useReelStore.getState();

  const viewVisibleConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(debounce(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index || 0);
    }
  }, 100)
  ).current

  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data?.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  }

  const fetchFeed = useCallback(debounce(async (offset: number) => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const newData = await fetchFeedReel(offset, 8);
      setOffset(offset + 8);
      if (newData?.length < 8) {
        setHasMore(false)
      }
    } catch (error) {
      console.log("feed video: ", error);

    } finally {
      setLoading(false)
    }
  }, 200), [loading, hasMore, data]);

  useEffect(() => {
    if (routeParams?.data) {
      setData(routeParams?.data);
      setOffset(routeParams?.data?.length);
    }
  }, [routeParams?.data])

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: screenHeight,
    offset: screenHeight * index,
    index
  }), [])

  const keyExtractor = useCallback((item: any) => item?._id.toString(), [])
  const renderVideoList = useCallback(({ item, index }: { item: any, index: number }) => {
    return (
      <VideoItem
        isVisible={index === currentVisibleIndex}
        item={item}
        preload={Math.abs(currentVisibleIndex + 3) >= index}
      />
    )
  }, [currentVisibleIndex])

  const memoizedValue = useMemo(
    () => renderVideoList,
    [currentVisibleIndex, data]
  )

  return (
    <CustomView>
      <FlatList
        viewabilityConfig={viewVisibleConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        maxToRenderPerBatch={2}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={memoizedValue}
        pagingEnabled
        disableIntervalMomentum={true}
        removeClippedSubviews
        initialNumToRender={1}
        onEndReachedThreshold={0.1}
        decelerationRate={'normal'}
        scrollEventThrottle={16}
        onEndReached={async () => {
          await fetchFeed(offset);
        }}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={Colors.white} />
            </View>
          ) : null
        }
      />

      <Image source={Loader} style={styles.thumbnail} />

      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name="arrow-back" color="white" size={RFValue(20)} />
        </TouchableOpacity>
      </View>

    </CustomView>
  )
}

export default FeedReelScrollScreen

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 10,
    zIndex: 99,
  },
  footer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    position: 'absolute',
    zIndex: -2,
    aspectRatio: 9 / 16,
    height: screenHeight,
    width: '100%',
    alignSelf: 'center',
    right: 0,
    left: 0,
    resizeMode: 'stretch',
    top: 0,
    bottom: 0,
  },
});