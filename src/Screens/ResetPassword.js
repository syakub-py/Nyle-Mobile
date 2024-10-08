import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, TextInput, Image} from 'react-native';
import {auth} from '../Components/Firebase';
import BackButton from '../Components/BackButton';
import {useNavigation} from '@react-navigation/native';

const handleResetPassword = (username) => {
  auth.sendPasswordResetEmail(username)
      .then(() => {
        alert('Password reset email sent successfully!');
        useNavigation().goBack();
      })
      .catch((error) => {
        console.log(error);
      });
};

export default function ResetPassword() {
  const [username, setUsername] = useState('');
  return (
    <View style = {styles.container}>
      <View style = {{marginTop: 69, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source = {require('../../assets/icon.png')}
          style = {{
            height: 150,
            width: 150,
          }}/>
      </View>
      <View style = {{position: 'absolute', top: 30, left: 15, height: 50, width: 50, elevation: 2, backgroundColor: 'whitesmoke', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
        <BackButton />
      </View>
      <TextInput placeholder ='Enter the Username' style = {styles.textInput} value = {username} onChangeText = {(text) => setUsername(text)} />
      <Pressable style = {styles.submitContainer} onPress = {handleResetPassword}>
        <Text style = {[styles.text, {color: 'white', fontWeight: '600', fontSize: 16}]}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textInput: {
    backgroundColor: 'whitesmoke',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  submitContainer: {
    backgroundColor: 'black',
    fontSize: 16,
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(255,22,84,0.25)',
    shadowOffset: {width: 0, height: 9},
    shadowOpacity: 1,
    shadowRadius: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});
