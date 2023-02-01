import { Text, StyleSheet, Image, View, Pressable } from 'react-native'
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';

export default function CheckOut({navigation}){
    return (
      <View style={{backgroundColor:'white', flex:1}}>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <View style={{position: 'absolute', top: 20, left: 20, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:70, opacity:0.8, alignItems:'center', justifyContent:'center'}}>
                    <Pressable onPress={()=>navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={30}/>
                    </Pressable>
                </View>
                <Text style={{marginTop:30, fontSize:25, fontWeight:'bold', }}>Title of Post</Text>
            </View>

            <View style={{backgroundColor:'lightgray', height:400, margin:30, borderRadius:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin:10}}>Purchase summary</Text>
            </View>

            <View style={{backgroundColor:'lightgray', height:100, margin:30, borderRadius:20, justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
                <Image source={{uri:"https://companieslogo.com/img/orig/COIN-a63dbab3.png?t=1648737284"}} style={{height:50, width:50, margin:20}}/>
                <Text style={{fontWeight:'bold', margin:10}}>******************9876</Text>
                <Pressable>
                    <Text>Change</Text>
                </Pressable>
            </View>


      </View>
    )
}
