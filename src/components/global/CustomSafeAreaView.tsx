import { View, ViewStyle, StyleSheet, SafeAreaView, Platform } from 'react-native'
import React, { FC, ReactNode } from 'react'
import { Colors } from '../../constants/Colors';
import { statusBarHeight } from '../../utils/Scaling';

interface CustomSafeAreaViewProps {
    children: ReactNode;
    style?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({children, style}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={[styles.container, styles.statusBar]}>{children}</View>
    </SafeAreaView>
  )
}

export default CustomSafeAreaView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
    },
    statusBar: {
        paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
    }
})