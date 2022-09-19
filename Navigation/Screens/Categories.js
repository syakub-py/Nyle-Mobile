import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PostCard from './Components/PostCard.js';

export default function Categories({navigation, route}){
    return(
        <SafeAreaView>
            <View style={{marginTop:30}}>
                <ScrollView>
                    <Text style={{marginLeft:16, fontSize:30, fontWeight:'bold'}}>{route.params.title}</Text>
                    <View style={{flexDirection:'row', height:80, shadowColor:'black', shadowOpacity:0.2}}>
                        <TextInput placeholder='Search...' placeholderTextColor={'gray'} style={{flex:1, fontWeight:'700', backgroundColor:'white', margin:20, borderRadius:10, elevation:1, paddingHorizontal:15,}}/>
                    </View>
                    <FlatList
                    data={route.params.Posts}
                    renderItem = {({item}) => (
                        <TouchableOpacity onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details: item.details, Description:item.description, images: [item.pic]})}>
                        <PostCard data ={item}/>
                        </TouchableOpacity>
                        )}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );

}