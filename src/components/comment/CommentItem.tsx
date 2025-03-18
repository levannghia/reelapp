import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useState } from 'react';
import { Colors } from '../../constants/Colors';
import CommentSingleItem from './CommentSingleItem';
import { getReplices } from '../../services/commentApi';
import CustomText from '../global/CustomText';
import LinearGradient from 'react-native-linear-gradient';

interface CommentItemProps {
  comment: Comment;
  user: User | undefined;
  onReply: (comment: Comment | SubReply, commentId: string | number) => void;
  scrollToParentComment: () => void;
  scrollToChildComment: (index: number) => void;
}

const CommentItem: FC<CommentItemProps> = ({
  comment,
  user,
  onReply,
  scrollToParentComment,
  scrollToChildComment,
}) => {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data?.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  }

  const fetchReplies = async (scrollOffset: number, commentId: string) => {
    setLoading(true);
    const newData = await getReplices(commentId, scrollOffset);
    const combinedData = [...replies, ...newData];
    setReplies(removeDuplicates(combinedData));
    setLoading(false);
  };

  const handleReply = (msg: any) => {
    onReply(msg, comment._id);
  }

  return (
    <View style={styles.commentContainer}>
      <View style={styles.textContainer}>
        <CommentSingleItem
          onReply={() => handleReply(comment)}
          comment={comment}
          user={user}
          scrollToComment={() => scrollToParentComment}
        />
      </View>
      {comment?.repliesCount > 0 && (
        <View style={{ marginLeft: 40 }}>
          {replies?.map((reply, index) => (
            <CommentSingleItem
              isReply
              key={reply._id}
              comment={reply}
              user={user}
              onReply={comment => handleReply(comment)}
              scrollToComment={() => scrollToChildComment(index)}
            />
          ))}

          {comment?.repliesCount - replies?.length > 0 ? (
            <TouchableOpacity
              style={styles.flexRow}
              onPress={async () => {
                setOffset(offset + 2);
                await fetchReplies(offset, comment._id);
              }}>
              <LinearGradient
                colors={[
                  'rgba(0, 0, 0, 0)',
                  Colors.disabled,
                  'rgba(0, 0, 0, 0)',
                ]}
                style={styles.linearGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
              <CustomText variant="h7" style={styles.viewRepliesText}>
                Show {comment?.repliesCount - replies.length}{' '}
                {comment?.repliesCount - replies.length > 1
                  ? 'replies'
                  : 'reply'}
              </CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.flexRow}
              onPress={async () => {
                setOffset(0);
                setReplies([]);
              }}>
              <LinearGradient
                colors={[
                  'rgba(0, 0, 0, 0)',
                  Colors.disabled,
                  'rgba(0, 0, 0, 0)',
                ]}
                style={styles.linearGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
              <CustomText variant="h7" style={styles.viewRepliesText}>
                Hide Replies
              </CustomText>
            </TouchableOpacity>
          )}

          {!loading && (
            <ActivityIndicator size="small" color={Colors.disabled} style={{ alignSelf: 'flex-start' }} />
          )}
        </View>
      )}
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    padding: 2,
  },
  textContainer: {
    flex: 1,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  linearGradient: {
    width: 50,
    height: 1,
    top: 2,
  },
  viewRepliesText: {
    color: Colors.lightText,
    marginTop: 5,
  },
});