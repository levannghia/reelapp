import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'

const UserItem: FC<{user: User; onPress?: () => void}> = ({user, onPress}) => {
  return (
    <View>
      <Text>UserItem</Text>
    </View>
  )
}

export default UserItem

const styles = StyleSheet.create({})