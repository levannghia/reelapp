import { StyleSheet, Text, View } from 'react-native';
import React, {FC, useState} from 'react';

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

  return (
    <View style={styles.commentContainer}>
      <View style={styles.textContainer}>
        
      </View>
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