import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import {User, Match} from '../models/';
import {DataStore} from '@aws-amplify/datastore';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
const PatnerScreen = () => {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);

  const getCurrentUser = async () => {
    const dbUsers = await DataStore.query(User);
    setMe(dbUsers[2]);
  };

  useEffect(() => getCurrentUser(), []);

  useEffect(async () => {
    const fetchMatches = async () => {
      console.log('me: ', me.id);
      const result = await DataStore.query(Match, m =>
        m
          .isMatch('eq', true)
          .or(m1 => m1.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      console.log('hole');
      console.log(result);
      setMatches(result);
    };
    fetchMatches();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 25, color: '#3AB4CC'}}>
          New Patners
        </Text>

        <View style={styles.users}>
          {matches.map(match => {
            const matchUser =
              match.User1ID === me.id ? match.User2 : match.User1;
            if (!match.User1 || !match.User2) {
              return (
                <View style={styles.user} key={match.id}>
                  <Image source={{}} style={styles.image} />
                  <Text style={styles.name}>New match</Text>
                </View>
              );
            }
            return (
              <View style={styles.user} key={match.id}>
                <Image source={{uri: matchUser.image}} style={styles.image} />
                <Text style={styles.name}>{matchUser.name}</Text>
              </View>
            );
          })}
        </View>

        {/*  <View style={styles.users}>
          {users.map(user => (
            <View style={styles.user} key={user.id}>
              <Image source={{uri: user.image}} style={styles.image} />
            </View>
          ))}
        </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  user: {
    width: 100,
    height: 100,
    margin: 8,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#008080',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default PatnerScreen;
