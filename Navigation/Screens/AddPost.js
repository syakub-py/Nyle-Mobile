import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput, Pressable, Alert,Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { Dropdown } from 'react-native-material-dropdown';
import { getstorage } from './Components/Firebase';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function AddPost(){
const [image, setImage] = React.useState(null);
const [uploading, setUploading] = React.useState(false);

const selectImage =async()=>{
    const options = {
        maxWidth: 2000,
        maxHeight: 2000,
        storageOptions: {
            skipBackup: true,
            path: 'images'
        }
    }
    
    await launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            const source = { uri: response.uri };
            console.log(source);
            setImage(source);
        }
        }).catch(err=>err);
    }

    const uploadImage = async ()=>{
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        const task = getstorage
        .ref(filename)
        .putFile(uploadUri);

        try {
            await task;
          } catch (e) {
            Alert(e);
          }
          Alert.alert(
            'Photo uploaded!',
            'Your photo has been uploaded to Firebase Cloud Storage!'
          );
          setImage(null);
    }

    return(
        <SafeAreaView>
            <ScrollView>
                <Pressable onPress={selectImage}>
                    <View style={{backgroundColor:'lightgray', margin:20, borderRadius:15}}>
                        <Ionicons name = {'aperture-outline'} size={250} style={{alignSelf:'center', color:'gray'}}/>
                    </View>
                </Pressable>
                <Button onClick={uploadImage} title = "upload images"/>
                <View>
                    
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Price</Text>
                    <TextInput placeholder='Enter price of item' style={styles.textinput}/>
                </View>
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Details</Text>
                    <TextInput placeholder='Enter Details of item' style={styles.textinput}/>
                </View>
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20,}}>Description</Text>
                    <TextInput placeholder='Enter full description of item' style={styles.textinput}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textinput:{
        backgroundColor:'lightgray',
        color:'gray',
        marginLeft:35,
        marginRight:35,
        fontSize:15,
        fontWeight:'600',
        height:50,
        borderRadius:10,
        paddingHorizontal:15,
    },
  });