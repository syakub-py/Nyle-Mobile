import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput } from 'react-native';
import {auth} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import {AddProfilePicture} from "./GlobalFunctions";
import BackButton from "./Components/BackButton";

const handleSignUp = (username, password, profilePic, navigation) => {
    auth
        .createUserWithEmailAndPassword(username, password)
        .then(() => {
            AddProfilePicture(username, profilePic).then(() => {
                navigation.navigate("Terms of Service", {showButtons:true, username:username})
            }).catch((error) => {
                console.log(error)
            });
        }).catch((error) => alert(error.message))
}

const SelectImages = async (setProfilePic) => {
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

const removeProfilePhoto = (setRefreshing, setProfilePic) => {
    setRefreshing(true);
    setProfilePic(null)
    setTimeout(() => setRefreshing(false), 300);
}
export default function SignUp({navigation}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [refreshing, setRefreshing] = useState(false);

    const RenderProfilePicSection = () => {
        if (profilePic == null) {
            return (
                <View style = {{margin:75, alignItems:'center'}}>
                    <Ionicons name={"person-add-outline"} size={100} style = {{borderRadius:100}}/>
                </View>
            )
        }
        return (
            <View style = {{margin:60, alignItems:'center'}}>
                <Pressable style = {{position:'absolute', left:5, top:10, zIndex:1}} onPress = {()=>removeProfilePhoto(setRefreshing, setProfilePic)}>
                    <View style = {{backgroundColor:'red', height:30, width:30, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                        <Ionicons name ='remove-outline' color = {'white'} size = {20} style = {{}}/>
                    </View>
                </Pressable>

                <Image source = {{uri:profilePic}} style = {{height:150, width:150, borderRadius:100}}/>
                <Text style = {{margin:10, fontWeight:'bold'}}>{username}</Text>
            </View>
        )
    }

    return (
        <View style = {styles.container}>

            <View style = {{position: 'absolute', top: 30, left: 15, height: 50, width: 50, elevation: 2 ,backgroundColor:'whitesmoke', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                <BackButton navigation={navigation}/>
            </View>

            <View style = {{alignItems:'center', justifyContent:'center'}}>
                <Pressable onPress = {()=>SelectImages(setProfilePic)}>
                    {RenderProfilePicSection()}
                </Pressable>
            </View>

            <TextInput placeholder ='Username' style = {styles.textInput} onChangeText = {(text) => setUsername(text)} />
            <TextInput placeholder ='Password' style = {styles.textInput} onChangeText = {(text) => setPassword(text)} secureTextEntry/>

            <Pressable style = {styles.submitContainer} onPress = {()=>handleSignUp(username, password, profilePic, navigation)}>
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
