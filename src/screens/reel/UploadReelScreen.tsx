import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import CustomHeader from '../../components/global/CustomHeader'
import { useRoute } from '@react-navigation/native'
import { Colors } from '../../constants/Colors'
import { FONTS } from '../../constants/Fonts'
import GradientButton from '../../components/global/GradientButton'
import { goBack } from '../../utils/NavigationUtil'

interface uriData {
  thumb_uri: string;
  file_uri: string;
}

const UploadReelScreen: FC = () => {
  const data = useRoute();
  const item = data?.params as uriData;
  const [caption, setCaption] = useState<string>('');

  return (
    <CustomSafeAreaView>
      <CustomHeader title='Upload' />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.flexDirectionRow}>
          <Image source={{ uri: item.thumb_uri }} style={styles.img} />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={caption}
            onChangeText={setCaption}
            placeholderTextColor={Colors.border}
            placeholder='Inter your caption here...'
            multiline={true}
            numberOfLines={8}
          />
        </View>
        <GradientButton
          text="Upload"
          iconName="upload"
          onPress={() => {
            goBack();
            // startUpload(item?.thumb_uri, item?.file_uri, caption);
          }}
        />
      </ScrollView>
    </CustomSafeAreaView>
  )
}

export default UploadReelScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 0,
    marginTop: 30,
    alignItems: 'center'
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,

  },
  img: {
    width: '25%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10
  },
  input: {
    height: 150,
    borderColor: 'grey',
    borderWidth: 1,
    color: Colors.text,
    borderRadius: 5,
    fontFamily: FONTS.Medium,
    padding: 10,
    marginVertical: 10,
    width: '68%'
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top'
  }
})