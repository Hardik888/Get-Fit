import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Card from './src/components/AppCard';
import users from './assets/data/users';
import Animated from 'react-native-reanimated';
import {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
const ROTATION = 60;
const App = () => {
  const [currentIndex, setcurrentIndex] = useState(0);
  const currentProfile = users[currentIndex];
  const {width: screenWidth} = useWindowDimensions();
  const translateX = useSharedValue(1);
  const hiddenTranslateX = 2 * screenWidth;
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      'deg',
  );
  const context = useSharedValue({x: 0});
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {x: translateX.value};
    })
    .onUpdate(event => {
      translateX.value = event.translationX + context.value.x;
    });

  return (
    <View style={styles.pageContainer}>
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Card user={currentProfile} />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
