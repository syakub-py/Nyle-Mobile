import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground } from 'react-native';
import PostCard from 'C:/Users/syaku/OneDrive/Documents/programs/JavaScript/Nyle/Shared/Card.js'
import { useState } from 'react';

export default function Home({navigation}) {
  const posts = [
    {
      id:1,
      title: "ipad Pro 11 inch",
      price: "560",
      currency: "SOL",
      location: "New York, NY",
      pictures: "./assets/ipad pro 12.jpg"
    },
    {
      id:2,
      title: "2015 lamborgini aventedor",
      price: "50",
      currency: "BTC",
      location: "New York, NY",
      pictures: "./assets/2015 Lamborghini Aventador.jpg"
    },
    {
      id:3,
      title: "2015 lamborgini Hurcan",
      price: "50",
      currency: "ETH",
      location: "New York, NY",
      pictures: "./assets/2015 Lamborghini Aventador.jpg"
    },
    {
      id:4,
      title: "2012 ford f-150",
      price: "10",
      currency: "DOGE",
      location: "New York, NY",
      pictures: "./assets/2015 Lamborghini Aventador.jpg"
    },
  ]
  
    return (
      <SafeAreaView style={{flex:1}}>
        <StatusBar style="auto" />
        <View style={{flex:1}}>
          <View style={{zIndex:0}}>
           <FlatList
           data={posts}
           renderItem = {({item}) => <PostCard data ={item}/>}
           />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
