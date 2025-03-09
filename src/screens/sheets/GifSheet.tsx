import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet'
import { screenHeight } from '../../utils/Scaling'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const GifSheet = (props: SheetProps<'gif-sheet'>) => {
    return (
        <ActionSheet
            id={props.sheetId}
            headerAlwaysVisible={true}
            isModal={true}
            onClose={() => SheetManager.hide(props.sheetId)}
            gestureEnabled={Platform.OS == 'ios'}
            keyboardHandlerEnabled={true}
            indicatorStyle={styles.indicator}
            enableGesturesInScrollView={Platform.OS === 'ios'}
            containerStyle={styles.container}
            springOffset={100}

        >

        </ActionSheet>
    )
}

export default GifSheet

const styles = StyleSheet.create({
    indicator: {
        height: 4,
        width: 40,
        top: 4,
        backgroundColor: Colors.border,
    },
    driver: {
        height: 0.2,
        backgroundColor: Colors.border,
        width: '100%'
    },
    inputContainer: {
        backgroundColor: '#1f1e1e',
        flexDirection: 'row',
        borderRadius: 10,
        paddingVertical: Platform.OS == 'ios' ? 10 : 0,
        paddingHorizontal: 8,
        marginVertical: 15,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: 2,
        marginHorizontal: 10,
        color: Colors.text,
    },
    loading: {
        marginTop: 20,
    },
    container: {
        backgroundColor: '#121212',
        height: screenHeight * 0.8,
    },
    header: {
        alignSelf: 'center',
        marginVertical: 8,
    },
});