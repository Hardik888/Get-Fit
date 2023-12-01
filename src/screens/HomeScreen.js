import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {fetchUserAttributes} from 'aws-amplify/auth';
import Card from '../components/AppCard';
import {User, Match} from '../models/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AnimatedStack from '../components/AnimatedStack';
import {DataStore} from 'aws-amplify/datastore';
const HomeScreen = () => {
  const [users, SetUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dbUsers = await DataStore.query(User);

      if (dbUsers.length <= 0) {
        return;
      }

      setMe(dbUsers[2]);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await DataStore.query(User);
      SetUsers(fetchedUsers);
    };
    fetchUsers();
  }, []);

  const onSwipeLeft = () => {
    if (!currentUser || !me) {
      return;
    }
    console.log('swipe left', currentUser.name);
  };
  const onSwipeRight = user => {
    if (!currentUser || !me) {
      return;
    }
    DataStore.save(
      new Match({
        User1ID: me.id,
        User2ID: currentUser.id,
        isMatch: false,
      }),
    );
    console.warn('swipe right', currentUser.name);
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({item}) => <Card user={item} />}
        setCurrentUser={setCurrentUser}
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
