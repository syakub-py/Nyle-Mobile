import * as React from 'react';
import { View, Text, StyleSheet, Image, Pressable, RefreshControl, TextInput } from 'react-native';
import {auth} from './Components/Firebase'
import {getstorage, firestore} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';


export default function SignUp({navigation}){
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [profilePic, setProfilePic] = React.useState('')
    const [refreshing, setRefreshing] = React.useState(false);

    const handleSignUp = () =>{
        auth
        .createUserWithEmailAndPassword(username, password)
        .then(userCredentials =>{
            const user = userCredentials.user;
        }).catch(error => alert(error.message))
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
        };  
    };

    const removeProfilePhoto = () => {
        setRefreshing(true);
        setProfilePic('')
        setTimeout(() => setRefreshing(false), 300);
    }

    const addUsernameToMap = async () => {
        try {
            // Upload profile picture to Firebase Storage and get the download URL
            const profilePicRef = getstorage.ref().child(`profilePictures/${username}`);
            await profilePicRef.put(profilePic);
            const downloadUrl = await profilePicRef.getDownloadURL();

            // Add username and profile picture download URL to Firestore
            const docRef = firestore.collection("ProfilePictures").doc(username);
            await docRef.set({
                username: username,
                FileName: downloadUrl
            });
            console.log("Username added to map successfully");
        } catch (error) {
            console.error("Error adding username to map:", error);
        }
    };

    return(
        <View style={styles.container}>

            <View style={{alignItems:'center', justifyContent:'center'}}>
                <Pressable onPress={SelectImages}>
                    {
                    (profilePic != '') ? (
                        <View style={{margin:60, alignItems:'center'}}>
                            <Pressable style={{position:'absolute', left:5, top:10, zIndex:1}} onPress={removeProfilePhoto}>
                                <View style={{backgroundColor:'red', height:30, width:30, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                                    <Ionicons name='remove-outline' color={'white'} size={20} style={{}}/>
                                </View>
                            </Pressable>
 
                            <Image source={{uri:profilePic}} style={{height:150, width:150, borderRadius:100}}/>
                            <Text style={{margin:10, fontWeight:'bold'}}>{username}</Text>
                        </View>
                    ):
                    (
                        <View style={{margin:75, alignItems:'center'}}>
                            <Text style={{fontWeight:'bold'}}>Upload a Profile Picture</Text>
                            <Ionicons name='person-circle-outline' size={100}/>
                        </View>
                    )
                    }
                </Pressable>
            </View>

            <TextInput placeholder='Username' style = {styles.textInput} onChangeText={(text) => setUsername(text)} />
            <TextInput placeholder='Password' style = {styles.textInput} onChangeText={(text)=> setPassword(text)} secureTextEntry/>

            <Pressable style={styles.submitContainer} onPress={handleSignUp}>
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
        backgroundColor:'lightgray',
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