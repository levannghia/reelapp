import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { FC } from 'react'
import HomeScreen from '../screens/dashboard/HomeScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import { RFValue } from 'react-native-responsive-fontsize'
import { Image, Platform, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { HomeTabIcon, ProfileTabIcon } from './TabIcon';
import { bottomBarStyles } from '../styles/NavigationBarStyles';
import { navigate } from '../utils/NavigationUtil';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Tab = createBottomTabNavigator();

const BottomTab: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingTop: Platform.OS === 'ios' ? RFValue(5) : 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          backgroundColor: 'transparent',
          height: Platform.OS === 'ios' ? 80 : 70,
          borderWidth: 0,
          position: 'absolute',
          borderTopWidth: 0
        },
        tabBarActiveTintColor: Colors.theme,
        tabBarInactiveTintColor: '#447777',
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Home') {
            return <HomeTabIcon focused={focused} />
          }
          if (route.name === 'Profile') {
            return <ProfileTabIcon focused={focused} />
          }
          // if(route.name === 'Home') {
          //   return <HomeTabIcon focused={focused}/>
          // }
        }
      })}

    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen
        name='Post'
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity onPress={() => navigate('PickReelScreen')} activeOpacity={0.5} style={bottomBarStyles.customMiddleButton}>
              <Image source={require('../assets/icons/add.png')} style={bottomBarStyles.tabIcon}/>
            </TouchableOpacity>
          )
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          }
        }}
      />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default BottomTab