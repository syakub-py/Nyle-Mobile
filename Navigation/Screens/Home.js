import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PostCard from './Components/PostCard.js';
import CategoryCard from './Components/CategoryCard';
import { Icon } from 'react-native-elements';


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
          <View style={{flexDirection:'row', height:80, shadowColor:'black', shadowOpacity:0.2}}>
            <TextInput placeholder='Search...' placeholderTextColor={'gray'} style={{flex:1, fontWeight:'700', backgroundColor:'white', margin:20, borderRadius:10, elevation:1,}}/>
          </View>
          <View style={{zIndex:0}}>
            <View>
              <ScrollView scrollEventThrottle={16}>
                <View>
                  <Text style={{fontSize: 19, fontWeight:'bold', paddingHorizontal:20}}>Categories</Text>
                </View>
                <View style={{height:130, marginTop: 20}}>
                  <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator = {false}>
                    <CategoryCard imageUri ={require("./CategoryImages/ipadPro.jpg")}/>
                    <CategoryCard imageUri ={require("./CategoryImages/2015-lamborghini-aventador.jpg")} />
                    <CategoryCard imageUri ={require("./CategoryImages/house.jpg")}/>
                    <CategoryCard imageUri ={require("./CategoryImages/bike.jpg")}/>
                    <CategoryCard imageUri ={require("./CategoryImages/fridge.jpg")}/>
                  </ScrollView>
                </View>
              </ScrollView>

            </View>
            <Text style={{color:'black', fontWeight:'bold', fontSize:19, paddingHorizontal:20}}>Top Posts</Text>
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
  
