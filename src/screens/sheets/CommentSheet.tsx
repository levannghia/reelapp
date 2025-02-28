import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet'
import { Colors } from '../../constants/Colors'
import { screenHeight } from '../../utils/Scaling'
import CustomText from '../../components/global/CustomText'
import { FONTS } from '../../constants/Fonts'
import { useAuthStore } from '../../state/userStore'

const CommentSheet = (props: SheetProps<'comment-sheet'>) => {
    const user = useAuthStore(state => state.user);
    const [replyTo, setReplyTo] = useState<Comment | SubReply | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchUserLoading, setSearchUserLoading] = useState<boolean>(false);
    const [filterData, setFilterData] = useState<User[]>([]);
    const [replyCommentId, setReplyCommentId] = useState<string | number | null>(
        null,
    );
    const [commentData, setCommentData] = useState<any[]>([]);
    const [mentionSearchWord, setMentionSearchWord] = useState<string | null>(
        null,
    );
    const [confirmMention, setConfirmMention] = useState<any | null>(null);

    const fetchSearchUserData = async () => {
        
    }

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
            onSnapIndexChange={() => Keyboard.dismiss()}
        >
            <CustomText variant='h6' fontFamily={FONTS.SemiBold} style={styles.header}>
                Comments
            </CustomText>
            <View style={styles.driver} />
        </ActionSheet>
    )
}

export default CommentSheet

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