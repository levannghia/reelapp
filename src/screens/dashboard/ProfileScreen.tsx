import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC, useRef, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { Colors } from '../../constants/Colors'
import CustomGradient from '../../components/global/CustomGradient'
import { CollapsibleRef, MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import ReelListTab from '../../components/profile/ReelListTab'
import ProfileDetail from '../../components/profile/ProfileDetail'
import { useAuthStore } from '../../state/userStore'
import { RFValue } from 'react-native-responsive-fontsize'
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen: FC = () => {
  const containerRef = useRef<CollapsibleRef>(null);
  const user = useAuthStore(state => state.user) as User;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const handleSetIndex = (newIndex: number) => {
    setFocusedIndex(newIndex);
    containerRef.current?.setIndex(newIndex);
  }
  const myTabs = [
    {
      name: 'Reel',
      component: <ReelListTab user={user} type='post'/>,
      icon: 'apps-sharp',
    },
    {
      name: 'Liked',
      component: <ReelListTab user={user} type='liked'/>,
      icon: 'heart',
    },
    {
      name: 'History',
      component: <ReelListTab user={user} type='watched'/>,
      icon: 'logo-tableau',
    }
  ]
  return (
    <CustomSafeAreaView style={styles.container}>
      <Tabs.Container
        lazy
        cancelLazyFadeIn
        revealHeaderOnScroll={true}
        renderHeader={() => <ProfileDetail user={user}/>}
        headerContainerStyle={styles.noOpacity}
        pagerProps={{
          onPageSelected: event => {
            setFocusedIndex(event.nativeEvent.position)
          },
          removeClippedSubviews: true
        }}
        renderTabBar={props => (
          <MaterialTabBar
            {...props}
            activeColor={Colors.white}
            inactiveColor={Colors.disabled}
            tabStyle={{
              backgroundColor: Colors.background,
            }}
            style={{
              backgroundColor: Colors.background,
              borderTopWidth: 1,
              borderColor: Colors.background,
            }}
            indicatorStyle={styles.indicatorStyle}
            TabItemComponent={({index, name, ...rest}) => (
              <TouchableOpacity
                key={index}
                style={styles.tabBar}
                onPress={() => handleSetIndex(index)}>
                <Icon
                  name={myTabs[index].icon}
                  size={RFValue(20)}
                  color={
                    focusedIndex === index ? Colors.text : Colors.inactive_tint
                  }
                />
              </TouchableOpacity>
            )}
          />
        )}
        ref={containerRef}
        containerStyle={{
          backgroundColor: Colors.background,
          paddingVertical: 0,
          elevation: 0,
          shadowColor: 'transparent',
          shadowOpacity: 0,
        }}
      >
        {myTabs.map((tab, index) => {
          return (
              <Tabs.Tab key={index} name={tab.name}>
                {tab.component}
              </Tabs.Tab>
            )
          })}
      </Tabs.Container>
      <CustomGradient position='bottom'/>
    </CustomSafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    overflow: 'hidden',
    paddingTop: 10,
    paddingVertical: 0,
    color: Colors.background
  },
  indicatorStyle: {
    backgroundColor: 'white',
    height: 0.8
  },
  noOpacity: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth:0
  },
  tabBar: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
})