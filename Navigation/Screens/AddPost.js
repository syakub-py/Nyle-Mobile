import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { Dropdown } from 'react-native-material-dropdown';

export default function AddPost(){
    return(
        <SafeAreaView>
            <ScrollView>
                <TouchableOpacity>
                    <View style={{backgroundColor:'lightgray', margin:20, borderRadius:15}}>
                        <Ionicons name = {'aperture-outline'} size={250} style={{alignSelf:'center', color:'gray'}}/>
                    </View>
                </TouchableOpacity>
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