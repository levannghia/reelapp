import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Alert, PermissionsAndroid, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import CustomText from '../../components/global/CustomText'
import { Colors } from '../../constants/Colors'
import { FONTS } from '../../constants/Fonts'
import { useRoute } from '@react-navigation/native'
import { useAuthStore } from '../../state/userStore'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { register, uploadFile } from '../../services/userAPI'
import GradientButton from '../../components/global/GradientButton'

interface initialData {
  id_token: string;
  provider: string;
  name: string;
  email: string;
  userImage: string;
}

const RegisterScreen = () => {

  const data = useRoute();
  const { checkUserNameAvailability } = useAuthStore();
  const item = data?.params as initialData;
  const [username, setUsername] = useState<string>('');
  const [usernameAvailable, setUsernameAvailable] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isLocalImagePickedUp, setIsLocalImagePickedUp] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFullName(item.name);
      setImageUri(item.userImage);
    }
  }, [item])

  const checkUsername = async () => {
    const data = await checkUserNameAvailability(username);
    setUsernameAvailable(data);
  }

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: handleLaunchCamera,
      },
      {
        text: 'Choose from Gallery',
        onPress: handleLaunchImageGallery,
      },
    ]);
  }

  const handleLaunchCamera = async () => {
    //Android only
    if (Platform.OS === 'android') {
      const grantedCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask me later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )

      if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          includeBase64: true,
        })
        if (result.assets && result.assets.length > 0) {
          setIsLocalImagePickedUp(true);
          setImageUri(result.assets[0].uri || '')
        }
      }

      return
    }

    //IOS only
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    })
    if (result.assets && result.assets.length > 0) {
      setIsLocalImagePickedUp(true);
      setImageUri(result.assets[0].uri || '')
    }
  }

  const handleLaunchImageGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1
    })

    if (result.assets && result.assets.length > 0) {
      console.log(result.assets);

      setIsLocalImagePickedUp(true);
      setImageUri(result.assets[0].uri || '')
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMessage("Creating Account...🚀");
    const trimmedUsername = username.trim().toLocaleLowerCase();
    const trimmedFullName = fullName.trim();
    const trimmedBio = bio.trim();

    if (!trimmedBio || !trimmedFullName || !trimmedUsername || !usernameAvailable) {
      Alert.alert("Please fill valid details");
      setLoading(false);
      setLoadingMessage('');
      return
    }

    let userImage = imageUri;
    if (isLocalImagePickedUp) {
      setLoadingMessage('Uploading Image...');
      const uploadResult = await uploadFile(imageUri, 'user_image');

      if(uploadResult) {
        userImage = uploadResult;
        setLoadingMessage('Image Uploaded...✔')
      } else {
        setLoading(false)
        setLoadingMessage('');
        return;
      }
    }

    setLoadingMessage('Preparing Dashboard...✨✨');

    const registerData = {
      name: fullName,
      bio,
      userImage,
      email: item?.email,
      provider: item?.provider,
      id_token: item?.id_token,
      username
    }

    await register(registerData);
    setLoading(false);
  }

  return (
    <CustomSafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.select({ ios: 120, android: 120 })}
      >
        <View style={styles.titleContainer}>
          <LinearGradient
            colors={[`rgba(0,0,0,0)`, Colors.text, `rgba(0,0,0,0)`]}
            style={styles.linearGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
          <CustomText variant="h3" fontFamily={FONTS.Reelz}>
            Complete your profile
          </CustomText>
          <LinearGradient
            colors={[`rgba(0,0,0,0)`, Colors.text, `rgba(0,0,0,0)`]}
            style={styles.linearGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleImagePicker}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require('../../assets/images/placeholder.png')
            }
            style={styles.image}
          />
          <View style={styles.cameraIcon}>
            <Icon name="camera-alt" color="white" size={RFValue(20)} />
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <CustomText style={styles.label}>Username</CustomText>
          {usernameAvailable != null && (
            <CustomText
              variant="h7"
              fontFamily={FONTS.SemiBold}
              style={[styles.label, { alignSelf: 'flex-end' }]}>
              {usernameAvailable ? '✅ Available' : '❌ Not Available'}
            </CustomText>
          )}
        </View>
        <TextInput
          style={styles.input}
          returnKeyType="next"
          value={username}
          placeholderTextColor={Colors.border}
          onChangeText={setUsername}
          onEndEditing={async () => {
            await checkUsername();
          }}
          placeholder="Enter Unique username"
        />

        <CustomText style={styles.label}>Full name</CustomText>
        <TextInput
          style={styles.input}
          returnKeyType="next"
          value={fullName}
          placeholderTextColor={Colors.border}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />

        <CustomText style={styles.label}>Short Bio</CustomText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          placeholderTextColor={Colors.border}
          onChangeText={setBio}
          placeholder="Enter your bio"
          numberOfLines={4}
        />

        {loading ? (
          <View style={styles.flexRow}>
            <ActivityIndicator size='small' color={Colors.text} />
            <CustomText variant='h7' fontFamily={FONTS.Medium}>
              {loadingMessage || 'loading...'}
            </CustomText>
          </View>
        ) : (
          <GradientButton
            text="Let's Dive in"
            iconName="swim"
            onPress={handleSubmit}
          />
        )}
      </KeyboardAwareScrollView>
    </CustomSafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  label: {
    alignSelf: 'flex-start',
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  linearGradient: {
    flex: 1,
    height: 1,
  },
  cameraIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 200,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: Colors.text,
    borderRadius: 5,
    fontFamily: FONTS.Medium,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
})