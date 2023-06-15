import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput } from 'react-native';
import {auth} from './Components/Firebase'
import {getstorage, firestore} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

export default function SignUp({navigation}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [refreshing, setRefreshing] = useState(false);

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(username, password)
        .then(() => {
            addUsernameToMap().then(() => {
                navigation.navigate("Terms of Service", {showButtons:true, username:username})
            }).catch((error) => {
                console.log(error)
            });
        }).catch((error) => alert(error.message))
    }
    
    const SelectImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
            const fileJson = result.assets;
            setProfilePic(fileJson[0].uri);
        }
    };

    const removeProfilePhoto = () => {
        setRefreshing(true);
        setProfilePic('')
        setTimeout(() => setRefreshing(false), 300);
    }

    const addUsernameToMap = async () => {
        try {
            // Upload profile picture to Firebase Storage and get the download URL
            const profilePicRef = getstorage.ref().child(`ProfileImages/${username}`);
            await profilePicRef.put(profilePic);
            const downloadUrl = await profilePicRef.getDownloadURL();

            // Add username and profile picture download URL to Firestore
            const docRef = firestore.collection("ProfileImages").doc(username);
            await docRef.set({
                username: username,
                FileName: downloadUrl
            });
        } catch (error) {
            console.error("Error adding username to map:", error);
        }
    };

    return (
        <View style = {styles.container}>

            <View style = {{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'whitesmoke', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                <Pressable onPress = {() =>navigation.goBack()}>
                    <Ionicons name ='chevron-back-outline' size = {30}/>
                </Pressable>
            </View>

            <View style = {{alignItems:'center', justifyContent:'center'}}>
                <Pressable onPress = {SelectImages}>
                    {
                    (profilePic != '') ? (
                        <View style = {{margin:60, alignItems:'center'}}>
                            <Pressable style = {{position:'absolute', left:5, top:10, zIndex:1}} onPress = {removeProfilePhoto}>
                                <View style = {{backgroundColor:'red', height:30, width:30, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                                    <Ionicons name ='remove-outline' color = {'white'} size = {20} style = {{}}/>
                                </View>
                            </Pressable>
 
                            <Image source = {{uri:profilePic}} style = {{height:150, width:150, borderRadius:100}}/>
                            <Text style = {{margin:10, fontWeight:'bold'}}>{username}</Text>
                        </View>
                    ):
                    (
                        <View style = {{margin:75, alignItems:'center'}}>
                            <Text style = {{fontWeight:'bold'}}>Upload a Profile Picture</Text>
                            <Image source = {{uri:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}} style = {{height:150, width:150, borderRadius:100}}/>
                        </View>
                    )
                    }
                </Pressable>
            </View>

            <TextInput placeholder ='Username' style = {styles.textInput} onChangeText= {(text) => setUsername(text)} />
            <TextInput placeholder ='Password' style = {styles.textInput} onChangeText= {(text) => setPassword(text)} secureTextEntry/>

            <Pressable style = {styles.submitContainer} onPress = {handleSignUp}>
                <Text style = {[styles.text, {color:'white', fontWeight:"600", fontSize: 16}]}>Sign Up</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    textInput:{
        backgroundColor:'whitesmoke',
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginTop:5,
        marginLeft:20,
        marginRight:20,
    },
    submitContainer:{
        backgroundColor:'black',
        fontSize:16,
        borderRadius:4,
        paddingVertical:12,
        marginTop:32,
        alignItems:'center',
        justifyContent:"center",
        shadowColor:"rgba(255,22,84,0.25)",
        shadowOffset: {width:0, height: 9},
        shadowOpacity: 1,
        shadowRadius: 20,
        marginLeft:20,
        marginRight:20,
    },
})
