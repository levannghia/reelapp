import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { Colors } from '../../constants/Colors'
import CustomGradient from '../../components/global/CustomGradient'

const ProfileScreen: FC = () => {
  return (
    <CustomSafeAreaView style={styles.container}>
      <CustomGradient position='bottom'/>
    </CustomSafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    overflow: 'hidden',
    paddingTop: 10,
    paddingVertical: 0,
    color: Colors.background
  },
  indicatorStyle: {
    backgroundColor: 'white',
    height: 0.8
  },
  noOpacity: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth:0
  },
  tabBar: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
})