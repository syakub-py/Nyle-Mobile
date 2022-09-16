import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Touchable, TouchableOpacity, TextInput } from 'react-native';

export default function SignUp({navigation}){
    return(
        <View style={styles.container}>
            <View style={{ alignItems:'center', justifyContent:'center'}}>
                <Image
                source ={require('C:/Users/syaku/OneDrive/Documents/programs/JavaScript/NyleVS/assets/icon.png')}
                style ={{
                    height: 150,
                    width: 150
                }}/>
                    
            </View>

            <TextInput placeholder='Username' style = {styles.textInput}/>
            <TextInput placeholder='Password' style = {styles.textInput}/>
            <TextInput placeholder='Confirm Password' style = {styles.textInput}/>

            <TouchableOpacity style={styles.submitContainer} onPress={()=>this.props.navigation.navigate('Home')}>
                        <Text style = {[styles.text, {color:'white', fontWeight:"600", fontSize: 16}]}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        margin:20
    },
    textInput:{
        marginBottom:20,
        width: '70%',
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
        shadowRadius: 20
    },
})