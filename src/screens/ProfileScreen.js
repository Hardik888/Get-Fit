import {useEffect} from 'react';
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  Alert,
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {User} from '../models/';
import 'aws-amplify/auth';
import {Auth} from '@aws-amplify/auth';
import {fetchUserAttributes} from 'aws-amplify/auth';

import {getCurrentUser} from 'aws-amplify/auth';
import {DataStore} from '@aws-amplify/datastore';
import {useAuthenticator} from '@aws-amplify/ui-react-native';
import {getNameOfDeclaration} from 'typescript';
import {get} from 'core-js/core/dict';

function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button style={styles.button} onPress={signOut} title="Sign Out" />;
}

const ProfileScreen = () => {
  const [sub, setSub] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  useEffect(() => {
    async function getquery() {
      try {
        const dbUsers = await DataStore.query(User);

        console.log(dbUsers[0].name);
        if (dbUsers.length < 0) {
          return;
        }
        const dbUser = dbUsers[0];
        setUser(dbUser);
        setName(dbUser.name);
        setBio(dbUser.bio);
        setGender(dbUser.gender);
        setLookingFor(dbUser.lookingFor);
      } catch (error) {
        console.log('Error retrieving posts', error);
      }
    } //get userinfo
    getquery();
  }),
    [];

  async function handleFetchUserAttributes() {
    try {
      const {sub} = await fetchUserAttributes(); // Destructure the sub property
      // Log the sub value
      return sub; // Return only the sub value
    } catch (error) {
      console.log(error);
      // Handle the error if needed, you might want to return a default value or rethrow the error
      throw error;
    }
  }

  const isValid = () => {
    return name && bio && gender && lookingFor;
  };
  const save = async () => {
    if (!isValid()) {
      console.warn('not valid');
      return;
    }
    const original = await DataStore.query(User, sub);
    if (user) {
      const updatedUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.bio = bio;
        updated.gender = gender;
        updated.lookingFor = lookingFor;
      });

      await DataStore.save(updatedUser);
    } else {
      const newsub = await handleFetchUserAttributes();
      setSub(newsub);
      const newUser = new User({
        sub: newsub,
        name,
        bio,
        gender,
        lookingFor,
        image:
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
      });

      await DataStore.save(newUser);
    }
    Alert.alert('User saved ');
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name..."
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="bio..."
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />

        <Text>Gender</Text>
        <Picker
          label="Gender"
          selectedValue={gender}
          onValueChange={itemValue => setGender(itemValue)}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>

        <Text>Looking for</Text>
        <Picker
          label="Looking for"
          selectedValue={lookingFor}
          onValueChange={itemValue => setLookingFor(itemValue)}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>

        <Pressable onPress={save} style={styles.button}>
          <Text>Save</Text>
        </Pressable>

        <SignOutButton />
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

  button: {
    backgroundColor: '#F63A6E',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  input: {
    margin: 10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
});

export default ProfileScreen;
