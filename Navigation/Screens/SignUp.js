import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Touchable, TouchableOpacity, TextInput } from 'react-native';
//import auth from './Components/Firebase'

export default function SignUp({navigation}){
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    // const handleSignUp = () =>{
    //     auth
    //     .createUserWithEmailAndPassword(username, password)
    //     .then(userCredentials =>{
    //         const user = userCredentials.user;
    //         console.log(user.email)
    //     })
    //     .catch(error => alert(error.message))
    // }
    return(
        <View style={styles.container}>
            <View style={{ alignItems:'center', justifyContent:'center'}}>
                <Image
                source ={require('./Components/icon.png')}
                style ={{
                    height: 150,
                    width: 150
                }}/>
                    
            </View>

            <TextInput placeholder='Username' style = {styles.textInput} onChangeText={text => setUsername(text)}/>
            <TextInput placeholder='Password' style = {styles.textInput} onChangeText={text => setPassword(text)}/>
            <TextInput placeholder='Confirm Password' style = {styles.textInput}/>

            <TouchableOpacity style={styles.submitContainer} >
                        <Text style = {[styles.text, {color:'white', fontWeight:"600", fontSize: 16}]}>Sign Up</Text>
            </TouchableOpacity>
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