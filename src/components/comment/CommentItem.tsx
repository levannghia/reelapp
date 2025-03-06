import { StyleSheet, Text, View } from 'react-native'
import React, {RC} from 'react'

interface CommentItemProps {
    comment: Comment;
    user: User | undefined;
    onReply: (comment: Comment | SubReply, commentId: string | number) => void;
    scrollToParentComment: () => void;
    scrollToChildComment: (index: number) => void;
}

const CommentItem: RC<CommentItemProps> = ({
    comment,
    user,
    onReply,
    scrollToParentComment,
    scrollToChildComment,
}) => {
  return (
    <View>
      <Text>CommentItem</Text>
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({})