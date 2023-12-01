import React from 'react';
import {Text, Image, View, ImageBackground, StyleSheet} from 'react-native';

const Card = props => {
  const {name, image, bio} = props.user;

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: image,
        }}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: '60%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
    marginTop: 70,
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 5,
  },
  image: {
    width: '140%',

    height: '105%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    elevation: 6,
  },
  cardInner: {
    resizeMode: 'cover',
    padding: 20,
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
  },
});

export default Card;
