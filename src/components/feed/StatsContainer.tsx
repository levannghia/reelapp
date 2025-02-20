import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '../../constants/Colors'
import CustomText from '../global/CustomText';
import { useAuthStore } from '../../state/userStore';

interface StatsDisplayProps {
    title: string;
    value: string;
}

const StatsDisplay: FC<StatsDisplayProps> = ({title, value}) => {
    return (
        <View style={styles.statsContainer}>
            <CustomText style={styles.title}>{title}</CustomText>
            <CustomText style={styles.value}>{value}</CustomText>
        </View>
    )
}

const StatsContainer: FC = () => {
    const {user, refetchUser} = useAuthStore.getState();

    useEffect(() => {
        refetchUser();
    })
  return (
    <View style={styles.container}>
      <StatsDisplay title='Followers' value={user?.followersCount}/>
      <View style={styles.diriver}/>
      <StatsDisplay title='Reels' value={user?.reelsCount}/>
      <View style={styles.diriver}/>
      <StatsDisplay title='Following' value={user?.followingCount}/>
      <View style={styles.diriver}/>
    </View>
  )
}

export default StatsContainer

const styles = StyleSheet.create({
    container: {
        top: -350,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: RFValue(30)
    },
    value: {
        fontSize: RFValue(60),
    },
    diriver: {
        height: '100%',
        backgroundColor: Colors.disabled,
        width: 3,
        marginHorizontal: 80
    }
})