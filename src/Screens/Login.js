import React, {useEffect, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {auth} from '../Components/Firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import ShowPassword from '../Components/ShowPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleEmailAndPasswordLogin = (username, password) => {
  auth.signInWithEmailAndPassword(username, password)
      .catch((error) => alert(error.message));
};

// const handleGoogleLogin = async () => {
//   try {
//     const result = await signInWithPopup(auth, new GoogleAuthProvider());
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     // The signed-in user info.
//     const user = result.user;
//     // IdP data available using getAdditionalUserInfo(result)
//   } catch (error) {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     console.log(errorMessage);
//   }
// };

export default function Login({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect( () => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        await AsyncStorage.setItem('@username', user.email);
        navigation.navigate('Main Container');
      }
    });
  }, []);


  return (
    <ScrollView style = {styles.container}>
      <View style = {{marginTop: 69, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source = {require('../../assets/icon.png')}
          style = {{
            height: 150,
            width: 150,
          }}/>
      </View>
      <View style = {{marginTop: 40, flexDirection: 'row', justifyContent: 'center'}}>
        <Pressable>
          <View style = {styles.socialButton}>
            <Ionicons name ='logo-facebook' size = {20} style = {{height: 20, width: 20, marginRight: 5}}/>
            <Text style = {{fontSize: 15, fontWeight: '500'}}>Facebook</Text>
          </View>
        </Pressable>

        <Pressable >
          <View style = {styles.socialButton}>
            <Ionicons name ='logo-google' size = {20} style = {{height: 20, width: 20, marginRight: 5}}/>
            <Text style = {{fontSize: 15, fontWeight: '500'}}>Google</Text>
          </View>
        </Pressable>
      </View>

      <View style = {{justifyContent: 'center', marginLeft: 15, marginRight: 15}}>
        <Text style = {[styles.text, {color: 'black', fontSize: 15, textAlign: 'center', marginVertical: 20}]}></Text>
        <View style = {{borderRadius: 6, height: 50, justifyContent: 'center'}}>
          <Ionicons name ='person-outline' size = {20} style = {{position: 'absolute'}}/>
          <TextInput placeholder ='Username' onChangeText = {(text) => setUsername(text)} style = {{marginLeft: 25}}/>
        </View>
        <View >
          <Ionicons name ='ellipse' size = {20} style = {{position: 'absolute'}}/>
          <TextInput
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            style={{marginLeft: 25}}
            secureTextEntry={!visible}
          />

          <ShowPassword visible={visible} setVisible={setVisible}/>

        </View>
        <Pressable onPress = {() => navigation.navigate('Reset Password')}>
          <Text style = {[styles.text, styles.link, {textAlign: 'right'}]}>forgot password?</Text>
        </Pressable>

        <Pressable
          style = {styles.submitContainer}
          onPress = {()=> handleEmailAndPasswordLogin(username, password)}
        >
          <Text style = {[styles.text, {color: 'white', fontWeight: '600', fontSize: 16}]}>Login</Text>
        </Pressable>

        <TouchableOpacity onPress = {() => navigation.navigate('Sign Up')}>
          <Text style = {[styles.text, {fontSize: 14, color: 'lightgray', textAlign: 'center', marginTop: 24}]}>Dont have an account? <Text style = {[styles.text, styles.link]}>Register now</Text></Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },

  text: {
    color: 'black',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(171, 180, 189, 0.65)',
    borderRadius: 30,
    backgroundColor: 'white',
    elevation: 2,
  },
  link: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
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
  },
});
