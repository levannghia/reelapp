import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '../../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from '../global/CustomText'

const PickerReelButton = () => {
    return (
        <View style={styles.flexRowBetween}>
            <TouchableOpacity style={styles.btn}>
                <Icon name='camera-outline' color={Colors.white} size={RFValue(20)} />
                <CustomText style={styles.btnText} variant='h7'>Camera</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <Icon name='camera-outline' color={Colors.white} size={RFValue(20)} />
                <CustomText style={styles.btnText} variant='h7'>Camera</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <Icon name='camera-outline' color={Colors.white} size={RFValue(20)} />
                <CustomText style={styles.btnText} variant='h7'>Camera</CustomText>
            </TouchableOpacity>
        </View>
    )
}

export default PickerReelButton

const styles = StyleSheet.create({
    flexRowBetween: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: '30%',
        height: 100,
        borderRadius: 10,
        backgroundColor: '#1c1b1b'
    },
    btnText: {
        marginTop: 5
    }
})