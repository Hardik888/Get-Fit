import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen';
import PatnerScreen from './src/screens/PatnerScreen';
import {clamp} from 'react-native-reanimated';

const App = () => {
  const color = '#b5b5b5';
  const activeColor = '#3AB4CC';
  const [activeScreen, setActiveScreen] = useState('HOME');
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
          <FontAwesome name="user" size={30} color={color} />
        </View>
        {activeScreen === 'HOME' && <HomeScreen />}
        {activeScreen === 'CHAT' && <PatnerScreen />}
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
    padding: 10,
    width: '100%',
  },
});

export default App;
