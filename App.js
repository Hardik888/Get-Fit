import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen';
import PatnerScreen from './src/screens/PatnerScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {Amplify} from 'aws-amplify';
import {DataStore} from '@aws-amplify/datastore';
import {Hub} from '@aws-amplify/core';
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import awsconfig from './src/aws-exports';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

const App = () => {
  const color = '#b5b5b5';
  const activeColor = '#3AB4CC';
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [isUserLoading, setIsUserLoading] = useState(true);
  useEffect(() => {
    // Create listener
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        console.log('User Model has finished syncing');
        setIsUserLoading(false);
      }
    });
    return () => listener();
  }, []);
  const renderPage = () => {
    if (activeScreen === 'HOME') {
      return <HomeScreen isUserLoading={isUserLoading} />;
    }

    if (isUserLoading) {
      return <ActivityIndicator style={{flex: 1}} />;
    }

    if (activeScreen === 'CHAT') {
      return <MatchesScreen />;
    }
    if (activeScreen === 'PROFILE') {
      return <ProfileScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => setActiveScreen('HOME')}>
            <Fontisto
              name="compass-alt"
              size={30}
              color={activeScreen === 'HOME' ? activeColor : color}
            />
          </Pressable>

          <MaterialCommunityIcons name="view-gallery" size={30} color={color} />
          <Pressable onPress={() => setActiveScreen('CHAT')}>
            <Ionicons
              name="chatbox-ellipses"
              size={30}
              color={activeScreen === 'CHAT' ? activeColor : color}
            />
          </Pressable>
          <Pressable onPress={() => setActiveScreen('PROFILE')}>
            <FontAwesome
              name="user"
              size={30}
              color={activeScreen === 'PROFILE' ? activeColor : color}
            />
          </Pressable>
        </View>

        {activeScreen === 'HOME' && <HomeScreen />}
        {activeScreen === 'CHAT' && <PatnerScreen />}
        {activeScreen === 'PROFILE' && <ProfileScreen />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
});

export default withAuthenticator(App);
