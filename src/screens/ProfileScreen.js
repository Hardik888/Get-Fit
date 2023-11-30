import {useEffect} from 'react';
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
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

function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button style={styles.button} onPress={signOut} title="Sign Out" />;
}

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  /* useEffect(() => {
    const handleFetchUserAttribute = async () => {
      try {
        const user = await fetchUserAttributes();
        console.warn(user);
        const dbUsers = await DataStore.query(
          User,
          u => u.sub === user.attributes.sub,
        );

        if (dbUsers.length < 0) {
          return;
        }
        const dbUser = dbUsers[0];

        setName(dbUser.name);
        setBio(dbUser.bio);
        setGender(dbUser.gender);
        setLookingFor(dbUser.lookingFor);
      } catch (err) {
        console.log(err);
      }
      getCurrentUser();
    };
  }, []); */
  async function handleFetchUserAttributes() {
    try {
      const {sub} = await fetchUserAttributes(); // Destructure the sub property
      console.log(sub); // Log the sub value
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

    const newUser = new User({
      sub: handleFetchUserAttributes(),
      bio,
      gender,
      lookingFor,
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
    });

    DataStore.save(newUser);
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
