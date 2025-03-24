import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/screens/sheets/sheet'
import { StatusBar, Platform } from 'react-native'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import React from 'react'
import Navigation from './src/navigation/Navigation';

GoogleSignin.configure({
  webClientId: '513988675635-783oppotro9ilm9fj24m0lnr22a8v6vv.apps.googleusercontent.com',
  forceCodeForRefreshToken: true,
  offlineAccess: false,

})

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor='transparent'/>
      <Navigation/>
    </GestureHandlerRootView>
  )
}

export default App