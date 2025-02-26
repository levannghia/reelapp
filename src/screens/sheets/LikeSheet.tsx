import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet'
import { screenHeight } from '../../utils/Scaling'
import { Colors } from '../../constants/Colors'
import CustomText from '../../components/global/CustomText'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize'
import { getListLikes } from '../../services/reelAPI'
import UserItem from '../../components/global/UserItem'

const LikeSheet = (props: SheetProps<"like-sheet">) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        setLoading(true);
        const data = await getListLikes(props.payload, search);
        setUsers(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [props.payload?.entityId, search])
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
        >
            <CustomText variant='h6' fontFamily={FONTS.SemiBold} style={styles.header}>
                Likes
            </CustomText>
            <View style={styles.inputContainer}>
                <Icon name="magnify" size={RFValue(15)} color={Colors.border} />
                <TextInput
                    style={styles.input}
                    placeholder="Search users"
                    placeholderTextColor={Colors.border}
                    value={search}
                    onChangeText={setSearch}
                />
                {search !== '' && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Icon
                            name="close-circle"
                            size={RFValue(14)}
                            color={Colors.border}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.text}
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={users}
          style={{height: '100%'}}
          keyExtractor={(item: User) => item._id?.toString()}
          renderItem={({item}) => <UserItem user={item} />}
        />
      )}
        </ActionSheet>
    )
}

export default LikeSheet

const styles = StyleSheet.create({
    indicator: {
        height: 4,
        width: 40,
        top: 4,
        backgroundColor: Colors.border,
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