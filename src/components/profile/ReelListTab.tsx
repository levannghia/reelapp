import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import ProfileReelCard from '../feed/ProfileReelCard';
import { navigate } from '../../utils/NavigationUtil';
import { Tabs } from 'react-native-collapsible-tab-view';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchReel } from '../../services/reelAPI';
import { screenWidth } from '../../utils/Scaling';

const ReelListTab: FC<{
  user: ProfileUser | undefined | User;
  type: 'post' | 'liked' | 'watched';
}> = ({ user, type }) => {
  const [loading, setLoading] = useState(true);
  const [offsetLoading, setOffsetLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);

  const removeDuplicates = (data: any[]) => {
    const uniqueDataMap = new Map();
    data.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  }

  const fetchReels = async (scrollOffset: number, isRefresh: boolean) => {
    if (scrollOffset == 0) {
      setLoading(true);
    } else {
      setOffsetLoading(true);
    }

    const reelData = {
      userId: user?.id,
      offset: scrollOffset,
    };
    let newData: any[] = [];

    if (type === 'post') {
      newData = await fetchReel(reelData, 'reel');
    } else if (type == 'liked') {
      newData = await fetchReel(reelData, 'likedreel');
    } else {
      newData = await fetchReel(reelData, 'watchedreel');
    }

    if (isRefresh) {
      setData([...newData]);
      setOffset(0);
    } else {
      setData(prevData => removeDuplicates([...prevData, ...newData]));
      setOffset(offset + newData.length);
    }

    if (newData.length < 5) {
      setHasMore(false);
    }

    setLoading(false);
    setOffsetLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchReels(0, false);
  }, [])

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <ProfileReelCard
        item={item}
        loading={loading}
        onPressReel={() => {
          navigate('ReelScrollScreen', {
            data: data,
            index: index,
          })
        }}
      />
    )
  }

  return (
    <Tabs.FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item: any, index: number) => index.toString()}
      numColumns={3}
      onEndReached={() => {
        if (hasMore) {
          fetchReels(offset, false);
        }
      }}
      removeClippedSubviews
      initialNumToRender={2}
      onEndReachedThreshold={0.1}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setData([]);
            setOffset(0);
            setHasMore(true);
            fetchReels(0, true);
          }}
        />
      }
      ListFooterComponent={() => {
        if (!offsetLoading && !loading) {
          return null;
        }
        return (
          <View
            style={{
              width: screenWidth,
              justifyContent: 'center',
              alignItems: 'center',
              height: 30,
            }}>
            <ActivityIndicator color={Colors.white} size="small" />
          </View>
        );
      }}
      ListEmptyComponent={() => {
        if (loading) {
          return null;
        }

        return (
          <View style={styles.emptyContainer}>
            <Icon
              name="play-circle-outline"
              size={RFValue(35)}
              color={Colors.white}
            />
            <CustomText fontFamily={FONTS.Medium} variant="h5">
              No {type} Reels here!
            </CustomText>
          </View>
        )
      }}
      contentContainerStyle={styles.flatlistContainer}
    />
  )
}

export default ReelListTab

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingVertical: 20,
    alignItems: 'flex-start',
    paddingBottom: 80,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: '100%',
  },
})