import { View, Text, StyleSheet, Animated, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import Logo from '../../assets/images/logo_t.png'
import CustomText from '../../components/global/CustomText'
import { FONTS } from '../../constants/Fonts'
import { tokenStorage } from '../../state/storage'
import {jwtDecode} from 'jwt-decode'
import { resetAndNavigate } from '../../utils/NavigationUtil'

interface DecodedToken {
  exp: number
}

const SplashScreen: FC = () => {
  const [isStop, setIsStop] = useState(false);
  const scale = new Animated.Value(1);

  const tokenCheck = async () => {
    const accessToken = tokenStorage.getString('access_token') as string;
    const refreshToken = tokenStorage.getString('refresh_token') as string;

    if(accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      const currentTime = Date.now() / 1000;
      if(decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen');
        Alert.alert("Session Expired, please login again");
        return;
      }

      if(decodedAccessToken?.exp < currentTime) {
        try {
          
        } catch (error) {
          console.log(error);
          Alert.alert("There was an error");
          return;
        }
      }

      resetAndNavigate('BottomTab');
      return;
    }

    resetAndNavigate('LoginScreen');

    return;
  }

  useEffect(() => {
    async function deeplinks() {
      await tokenCheck();
    }

    deeplinks();
  }, [])

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1, // scale up
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, // scale down
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    if(!isStop) {
      breathingAnimation.start();
    }

    return () => {
      breathingAnimation.stop();
    }
  }, [isStop])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          style={{
            width: '60%',
            height: '25%',
            resizeMode: 'contain',
            transform: [{scale}]
          }}
          source={Logo}
        />
        <CustomText variant='h3' fontFamily={FONTS.Reelz}>Reelzzz</CustomText>
      </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})