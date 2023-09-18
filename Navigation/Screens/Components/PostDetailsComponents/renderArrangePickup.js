import {Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

export default function renderArrangePickup(item, username, profilePic){
    if (item.PostedBy !== username){
        return(
            <Pressable onPress={()=>{navigation.navigate("Transaction Calendar", {item:item ,currentUsername:username, currentProfilePic:profilePic})}} style = {{flexDirection:'row', position: 'absolute', bottom: 0, height:70, width:width-50, justifyContent:'space-evenly', backgroundColor:'black', alignItems:'center', marginLeft:25, marginRight:25, marginBottom:10, borderRadius:10}}>
                <Ionicons name={"calendar-outline"} size={20} color={"white"}/>
                <Text style = {{color:'white', fontSize:15, fontWeight:"bold"}}>Arrange a pickup</Text>
            </Pressable>
        )
    }else{
        return(
            <View/>
        )
    }
}