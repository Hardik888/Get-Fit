import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import Card from '../components/AppCard';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AnimatedStack from '../components/AnimatedStack';

const HomeScreen = () => {
  const [users, SetUsers] = useState([]);
  const onSwipeLeft = user => {
    console.log('swipe left', user.name);
  };
  const onSwipeRight = user => {
    console.log('swipe right', user.name);
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({item}) => <Card user={item} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.icons}>
        <FontAwesome name="undo" size={33} color="#3AB4CC" />
        <Entypo name="cross" size={36} color="#3AB4CC" />
        <FontAwesome name="star" size={33} color="#FBD88B" />
        <FontAwesome name="heart" size={33} color="#3AB4CC" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
});

export default HomeScreen;
