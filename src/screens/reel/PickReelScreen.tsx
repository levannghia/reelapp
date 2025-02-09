import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import CustomHeader from '../../components/global/CustomHeader'
import PickerReelButton from '../../components/reel/PickerReelButton'
import CustomText from '../../components/global/CustomText'
import { FONTS } from '../../constants/Fonts'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const PickReelScreen: FC = () => {
  return (
    <CustomSafeAreaView style={{ paddingHorizontal: 0 }}>
      <View style={styles.margin}>
        <CustomHeader title='New Reel' />
      </View>
      <View style={{ padding: 8 }}>
        <PickerReelButton />
        <View style={styles.flexRow}>
          <CustomText variant="h6" fontFamily={FONTS.Medium}>
            Recent
          </CustomText>
          <Icon name="chevron-down" size={RFValue(20)} color={Colors.white} />
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default PickReelScreen

const styles = StyleSheet.create({
  margin: {
    margin: 10
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    margin: 8,
    marginTop: 20,
  },
})