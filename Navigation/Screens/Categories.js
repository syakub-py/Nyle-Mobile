import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PostCard from './Components/PostCard.js';

export default function Categories({navigation, route}){
    const posts = [
        {
          id:1,
          title: "ipad Pro 11 inch",
          price: "560",
          currency: "SOL",
          location: "New York, NY",
          pic: require('../PostImages/image 1.jpg')
        },
        {
          id:2,
          title: "2015 lamborgini aventedor",
          price: "50",
          currency: "BTC",
          location: "New York, NY",
          pic: require('../PostImages/image 2.jpg')
        },
        {
          id:3,
          title: "2015 lamborgini Hurcan",
          price: "50",
          currency: "ETH",
          location: "New York, NY",
          pic: require('../PostImages/image 3.jpg')
        },
        {
          id:4,
          title: "2012 ford f-150",
          price: "10",
          currency: "DOGE",
          location: "New York, NY",
          pic: require('../PostImages/image 4.jpg')
        },
      ]
    return(
        <SafeAreaView>
            <View style={{marginTop:30}}>
                <ScrollView>
                    <Text style={{marginLeft:16, fontSize:30, fontWeight:'bold'}}>{route.params.title}</Text>
                    <View style={{flexDirection:'row', height:80, shadowColor:'black', shadowOpacity:0.2}}>
                        <TextInput placeholder='Search...' placeholderTextColor={'gray'} style={{flex:1, fontWeight:'700', backgroundColor:'white', margin:20, borderRadius:10, elevation:1,}}/>
                    </View>
                    <FlatList
                    data={route.params.Posts}
                    renderItem = {({item}) => (
                        <TouchableOpacity onPress={() => navigation.navigate("post details", {PostTitle: item.title})}>
                        <PostCard data ={item}/>
                        </TouchableOpacity>
                        )}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );

}