import { View, Text, StyleSheet, Animated, Alert, Linking } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import Logo from '../../assets/images/logo_t.png'
import CustomText from '../../components/global/CustomText'
import { FONTS } from '../../constants/Fonts'
import { tokenStorage } from '../../state/storage'
import { jwtDecode } from 'jwt-decode'
import { navigate, resetAndNavigate } from '../../utils/NavigationUtil'
import { extractTypeAndId } from '../../utils/DateUtils'
import { getReelById } from '../../services/reelAPI'

interface DecodedToken {
  exp: number
}

const SplashScreen: FC = () => {
  const [isStop, setIsStop] = useState(false);
  const scale = new Animated.Value(1);

  const tokenCheck = async () => {
    const accessToken = tokenStorage.getString('access_token') as string;
    const refreshToken = tokenStorage.getString('refresh_token') as string;

    if (accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      const currentTime = Date.now() / 1000;
      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen');
        Alert.alert("Session Expired, please login again");
        return false;
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {

        } catch (error) {
          console.log(error);
          Alert.alert("There was an error");
          return false;
        }
      }

      resetAndNavigate('BottomTab');
      return true;
    }

    resetAndNavigate('LoginScreen');

    return false;
  }

  const handleNoUrlCase = (deepLinkType: string) => {
    if (deepLinkType === 'RESUME') {
      resetAndNavigate('BottomTab');
    }
  }

  const handleUserCase = (deepLinkType: string, id: string) => {
    if (deepLinkType === 'RESUME') {
      resetAndNavigate('BottomTab');
    }

    navigate('UserProfileScreen', { username: id });
  }

  const handleDefaultCase = (deepLinkType: string) => {
    if (deepLinkType === 'RESUME') {
      resetAndNavigate('BottomTab');
    }
  }

  const handleDeepLink = async (event: any, deepLinkType: string) => {
    const tokenValid = await tokenCheck();
    if (!tokenValid) return;

    const { url } = event;
    if (!url) {
      handleNoUrlCase(deepLinkType);
      return;
    };
    const { type, id } = extractTypeAndId(url);

    switch (type) {
      case 'reel':
        await getReelById(id, deepLinkType);
        break;
      case 'user':
        handleUserCase(deepLinkType, id);
        break;
      default:
        handleDefaultCase(deepLinkType);
        break;
    }
  }

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      handleDeepLink({ url }, 'CLOSE')
      console.log(url);
    });

    Linking.addEventListener('url', (event) => {
      handleDeepLink(event, 'RESUME')
      console.log(event);
    })
    // async function deeplinks() {
    //   await tokenCheck();
    // }

    // deeplinks();
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

    if (!isStop) {
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
            transform: [{ scale }]
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