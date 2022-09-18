import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PostCard from './Components/PostCard.js';
import CategoryCard from './Components/CategoryCard';
import faker from 'faker';



export default function Home({navigation}) {
  //posts for home screen
    const HomeScreenPosts = [
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
  //posts for Homes
    const HomePosts = [
        {
          id:1,
          title: faker.address.streetAddress(),
          price: "560",
          currency: "SOL",
          location: faker.address.state(),
          // pic: require('../PostImages/ipadPro.jpg')
        },
        {
          id:2,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "BTC",
          location:faker.address.state(),
          // pic: require('../PostImages/2015 Lamborghini Aventador.jpg')
        },
        {
          id:3,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "ETH",
          location: faker.address.state(),
          // pic: require("../assets/2015 Lamborghini Aventador.jpg")
        },
        {
          id:4,
          title: faker.address.streetAddress(),
          price: "10",
          currency: "DOGE",
          location: faker.address.state(),
          // pic: require("../assets/2015 Lamborghini Aventador.jpg")
        },
    ]
    //posts for automobiles
    const CarPosts = [
      {
        id:1,
        title: faker.address.streetAddress(),
        price: "560",
        currency: "SOL",
        location: "New York, NY",
        // pic: require('../PostImages/ipadPro.jpg')
      },
      {
        id:2,
        title: faker.address.streetAddress(),
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        // pic: require('../PostImages/2015 Lamborghini Aventador.jpg')
      },
      {
        id:3,
        title: faker.address.streetAddress(),
        price: "50",
        currency: "ETH",
        location: "New York, NY",
        // pic: require("../assets/2015 Lamborghini Aventador.jpg")
      },
      {
        id:4,
        title: faker.address.streetAddress(),
        price: "10",
        currency: "DOGE",
        location: "New York, NY",
        // pic: require("../assets/2015 Lamborghini Aventador.jpg")
      },
    ]
    //posts for tech
    const TechPosts = [
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
    //posts for bikes
    const BikePosts = [
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
    //posts for appliences
    const AppliencePosts = [
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
        <ScrollView>
          <View style={{margin:20}}>
            <Text style={{color:'gray', fontSize:15, fontWeight:'500'}}>Welcome back,</Text>
            <Text style={{fontSize:25, fontWeight:'bold'}}>Samuel Y</Text>
          </View>
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

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Tech', Posts:TechPosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/ipadPro.jpg")}/>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Automobiles', Posts:CarPosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/2015-lamborghini-aventador.jpg")} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Homes',Posts:HomePosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/house.jpg")}/>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Bikes',Posts:BikePosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/bike.jpg")}/>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'appliences',Posts:AppliencePosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/fridge.jpg")}/>
                      </TouchableOpacity>
                      
                    </ScrollView>
                  </View>
                </ScrollView>

              </View>
              <Text style={{color:'black', fontWeight:'bold', fontSize:19, paddingHorizontal:20}}>Top Posts</Text>
              <FlatList
              data={HomeScreenPosts}
              renderItem = {({item}) => (
                <TouchableOpacity onPress={() => navigation.navigate("post details", {PostTitle: item.title})}>
                  <PostCard data ={item}/>
                </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}
  
