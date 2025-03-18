import { ActivityIndicator, FlatList, Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet'
import { Colors } from '../../constants/Colors'
import { screenHeight } from '../../utils/Scaling'
import CustomText from '../../components/global/CustomText'
import { FONTS } from '../../constants/Fonts'
import { useAuthStore } from '../../state/userStore'
import { getSearchUser } from '../../services/userAPI'
import { debounce, set } from 'lodash'
import { getComments, postComment } from '../../services/commentApi'
import UserItem from '../../components/global/UserItem'
import CommentItem from '../../components/comment/CommentItem'
import CommentInput from '../../components/comment/CommentInput'

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
    const flatListRef = useRef<FlatList>(null);
    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
    };
    const scrollToComment = (index: number, childIndex: number = 0) => {
        const sum = index + childIndex;
        if(flatListRef.current && sum < commentData?.length) {
            flatListRef.current?.scrollToIndex({
                index: sum,
                animated: true,
                viewOffset: 0,
            });
        }
    }

    const removeDulicate = (data: any[]) => {
        const uniqueDataMap = new Map();
        data.forEach((item) => {
            if (!uniqueDataMap.has(item._id)) {
                uniqueDataMap.set(item._id, item);
            }
        });

        return Array.from(uniqueDataMap.values());
    };

    const fetchSearchUserData = async () => {
        setSearchUserLoading(true);
        const searchUserData = await getSearchUser(mentionSearchWord || '');
        // console.log(searchUserData);
        setSearchUserLoading(false);
        setFilterData(searchUserData);
    }
    const debouncedFetchUserData = debounce(fetchSearchUserData, 300);

    const fetchComments = async (scrollOffset: number) => {
        setLoading(true);
        const newData = await getComments(props?.payload?.id || '', scrollOffset);
        
        setOffset(scrollOffset + 5);
        if (newData.length < 5) {
            setHasMore(false);
        }

        setCommentData(removeDulicate([...commentData, ...newData]));
        setLoading(false);
    }

    const handleReplyComment = (data: any) => {

    }

    const handlePostComment = async (data: any) => {
        // console.log(data);
        const newCommentId = commentData.length + 1;
        const timestamp = new Date().toISOString();

        const newComment = {
            _id: newCommentId,
            user: user,
            comment: data.comment || '',
            likes: 0,
            timestamp: timestamp,
            hasGif: data.hasGif || false,
            isPosting: true,
            gifUrl: data.hasGif ? data.gifUrl : undefined,
            replies: [],
            repliesCount: 0,
        };

        commentData.unshift(newComment);
        scrollToTop();
        setReplyTo(null);
        setReplyCommentId(null);

        const commentPostData = {
            reelId: props.payload?.id,
            ...(data?.hasGif ? {gifUrl: data.gifUrl} : {comment: data?.comment}),
        }

        const commentResponse = await postComment(commentPostData, props.payload?.commentsCount || 0);
        const tempCommentIndex = commentData.findIndex(comment => comment._id === newCommentId);
        if(tempCommentIndex !== -1) {
            commentData[tempCommentIndex] = commentResponse;
            commentData[tempCommentIndex].user = user;
            setCommentData([...commentData]);
        }
    }

    const handleReply = (comment: Comment | SubReply, replyCommentId: string | number) => {

    }
    // console.log(commentData);

    useEffect(() => {
        debouncedFetchUserData();
        return () => {
            debouncedFetchUserData.cancel();
        }
    }, [mentionSearchWord])

    useEffect(() => {
        fetchComments(0);
    }, [props?.payload?.id])

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
            {mentionSearchWord != null ? (
                <FlatList
                    data={filterData || []}
                    keyboardShouldPersistTaps='always'
                    keyboardDismissMode='interactive'
                    keyExtractor={(item: User) => item._id?.toString()}
                    renderItem={({ item }) => (
                        <UserItem
                            user={item}
                            onPress={() => {
                                const dataMention = {
                                    user: item,
                                    replaceWord: mentionSearchWord
                                }

                                setConfirmMention(dataMention);
                            }}
                        />
                    )}
                    style={{ height: '100%', marginTop: 20 }}
                    ListFooterComponent={() => (
                        <>
                            {searchUserLoading && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        margin: 20,
                                        alignItems: 'center',
                                        gap: 4,
                                    }}>
                                    <CustomText variant="h7" style={{ color: Colors.lightText }}>
                                        {mentionSearchWord != '' &&
                                            `Searching for ${mentionSearchWord}`}
                                    </CustomText>
                                    <ActivityIndicator color={Colors.border} size="small" />
                                </View>
                            )}
                        </>
                    )}
                />
            ) : (
                <FlatList
                    nestedScrollEnabled
                    ref={flatListRef}
                    style={{ height: '100%' }}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="interactive"
                    data={commentData}
                    onScrollToIndexFailed={() => { }}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    removeClippedSubviews={true}
                    onEndReachedThreshold={0.08}
                    ListFooterComponent={() => {
                        if (!loading) {
                            return null;
                        }
                        return (
                            <View style={{ marginTop: 20 }}>
                                <ActivityIndicator color={Colors.white} size="small" />
                            </View>
                        );
                    }}
                    onEndReached={() => {
                        if (hasMore) {
                            fetchComments(offset);
                        }
                    }}
                    ListEmptyComponent={() => {
                        if (loading) {
                            return null;
                        }
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 40,
                                }}>
                                <CustomText>No Comments yet!</CustomText>
                            </View>
                        );
                    }}
                    keyExtractor={item => item._id.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <CommentItem
                                user={props?.payload?.user}
                                scrollToParentComment={() => scrollToComment(index)}
                                comment={item}
                                scrollToChildComment={childIndex => scrollToComment(index, childIndex)}
                                onReply={(comment, replyCommentId) => handleReply(comment, replyCommentId)}
                            />
                        );
                    }}
                />
            )}

            <CommentInput
                setMentionSearchWord={(value) => setMentionSearchWord(value)}
                confirmMention={confirmMention}
                replyTo={replyTo}
                onPostComment={(data: any) => {
                    if (replyCommentId) handleReplyComment(data);
                    else handlePostComment(data);
                }}
                clearReplyTo={() => {
                    setReplyTo(null);
                    setReplyCommentId(null);
                }}
            />
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