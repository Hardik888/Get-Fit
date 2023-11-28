import React, {useEffect, useState} from 'react';
import {Image, View, StyleSheet, useWindowDimensions} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

import Card from './src/components/AppCard';
import users from './assets/data/users';
import Like from './assets/images/LIKE.png';
import Nope from './assets/images/nope.png';
const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = users[currentIndex];
  const nextProfile = users[nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const translateX = useSharedValue(1);

  const hiddenTranslateX = 2 * screenWidth;

  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      'deg',
  );

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

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1.1, 0.8, 1.1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.5, 1],
    ),
  }));

  const LikeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
  }));

  const NopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: event => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      translateX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        {},
        () => {
          runOnJS(setCurrentIndex)(currentIndex + 1);
        },
      );
    },
  });

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  return (
    <View style={styles.pageContainer}>
      <GestureHandlerRootView style={styles.gestureHandlerRoot}>
        {nextProfile && (
          <View style={styles.nextCardContainer}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
              <Card user={nextProfile} />
            </Animated.View>
          </View>
        )}

        {currentProfile && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
              <Animated.Image
                source={Nope}
                style={[styles.like, {right: 10}, NopeStyle]}
                resizeMode="contain"
              />
              <Animated.Image
                source={Like}
                style={[styles.like, {left: 10}, LikeStyle]}
                resizeMode="contain"
              />
              <Card user={currentProfile} />
            </Animated.View>
          </PanGestureHandler>
        )}
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
  gestureHandlerRoot: {
    flex: 1,
  },
  animatedCard: {
    width: '120%',
    height: '110%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    justifyContent: 'center',
    backfaceVisibility: 'white',
    alignItems: 'center',
  },
  like: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 150,
    zIndex: 1,
  },
});

export default App;
