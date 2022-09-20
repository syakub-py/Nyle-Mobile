import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Touchable, TouchableOpacity, TextInput } from 'react-native';
import auth from './Components/Firebase';



export default function Login({navigation, route}){
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    React.useEffect(()=>{
       const unsubcribe =  auth.onAuthStateChanged(user =>{
            if(user){
                navigation.navigate('Home')
            }
        })
        return unsubcribe;
    }, [])
    
    
    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(route.params.username, route.params.password)
        .then(userCredentials =>{
            const user = userCredentials.user;
            console.log(user.email)
        })
        .catch(error => alert(error.message))
    }



    return(
        <ScrollView style ={styles.container}>
            <View>
                <View style={{marginTop:69, alignItems:'center', justifyContent:'center'}}>
                    <Image
                    source ={require('C:/Users/syaku/OneDrive/Documents/programs/JavaScript/NyleVS/assets/icon.png')}
                    style ={{
                        height: 150,
                        width: 150
                    }}/>
                    
                </View>
                <View style ={{marginTop:40, flexDirection: "row", justifyContent:"center"}}>
                    <TouchableOpacity>
                        <View style = {styles.socialButton}>
                            <Image source={{uri:"https://1000logos.net/wp-content/uploads/2021/10/logo-Meta.png"}} style ={{height:20, width:20, marginRight:5}}/>
                            <Text style ={styles.text}>Facebook</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style = {styles.socialButton}>
                            <Image source={{uri:"https://image.similarpng.com/very-thumbnail/2020/06/Logo-google-icon-PNG.png"}} style ={{height:20, width:20, marginRight:5}}/>
                            <Text style ={styles.text}>Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={[styles.text, {color:'black', fontSize:15, textAlign:'center', marginVertical:20}]}>or</Text>
                    <View style={{borderRadius:6, height:50, justifyContent:'center', }}>
                        <TextInput placeholder='Username' onChangeText={text => setUsername(text)} style={styles.input}/>
                    </View>
                    <View>
                        <TextInput placeholder='Password' onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry/>
                    </View>
                    <Text style={[styles.text, styles.link, {textAlign:'right'}]}>forgot password?</Text>

                    <TouchableOpacity
                        style={styles.submitContainer}
                        onPress = {()=> navigation.navigate("Main Container")}
                        >
                        <Text style = {[styles.text, {color:'white', fontWeight:"600", fontSize: 16}]}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> navigation.navigate("Sign Up")}>
                        <Text style = {[styles.text, {fontSize:14, color:"lightgray", textAlign:"center", marginTop:24}]}>Dont have an account? <Text style={[styles.text, styles.link]}>Register now</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "white",
        paddingHorizontal: 20
    },
    input:{
        backgroundColor:'lightgray',
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginTop:5,
    },
    text: {
      color: 'black',
    },
    socialButton:{
        flexDirection:"row",
        marginHorizontal:12,
        paddingVertical: 12,
        paddingHorizontal:12,
        paddingHorizontal:30,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor:"rgba(171, 180, 189, 0.65)",
        borderRadius:4,
        backgroundColor: 'white',
        shadowColor: 'lightgray',
        shadowOffset: {width: 0, height:10},
        shadowOpacity:1,
        shadowRadius:20,
        elevation:5
    },
    link:{
        color:"black",
        fontSize:14,
        fontWeight: '500'
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
});

