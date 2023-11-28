import React from 'react';
import {View, StyleSheet} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import PatnerScreen from './src/screens/PatnerScreen';
const App = () => {
  return (
    <View style={styles.pageContainer}>
      <PatnerScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default App;
