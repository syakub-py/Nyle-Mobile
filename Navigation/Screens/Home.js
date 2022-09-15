import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import PostCard from 'C:/Users/syaku/OneDrive/Documents/programs/JavaScript/NyleVS/Shared/Card.js';
import axios, { Axios } from 'axios';


//console.log(Axios.get('http://192.168.238.115:3000/getPosts'))


export default function Home({navigation}) {
  const posts = [
    {
      id:1,
      title: "ipad Pro 11 inch",
      price: "560",
      currency: "SOL",
      location: "New York, NY",
      // pic: require('../PostImages/ipadPro.jpg')
    },
    {
      id:2,
      title: "2015 lamborgini aventedor",
      price: "50",
      currency: "BTC",
      location: "New York, NY",
      // pic: require('../PostImages/2015 Lamborghini Aventador.jpg')
    },
    {
      id:3,
      title: "2015 lamborgini Hurcan",
      price: "50",
      currency: "ETH",
      location: "New York, NY",
      // pic: require("../assets/2015 Lamborghini Aventador.jpg")
    },
    {
      id:4,
      title: "2012 ford f-150",
      price: "10",
      currency: "DOGE",
      location: "New York, NY",
      // pic: require("../assets/2015 Lamborghini Aventador.jpg")
    },
  ]



    return (
      <SafeAreaView style={{flex:1}}>
        <StatusBar style="auto" />
        <View style={{flex:1}}>
          <View style={{zIndex:0}}>
           <FlatList
           data={posts}
           renderItem = {({item}) => (

            <TouchableOpacity onPress={() => navigation.navigate("post details")}>
              <PostCard data ={item}/>
           </TouchableOpacity>

            )}
           />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
