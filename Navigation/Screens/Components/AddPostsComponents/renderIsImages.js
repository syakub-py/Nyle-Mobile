import {Dimensions, Pressable, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import _ from "lodash";


export default function isImageUrls(imageUrls, setImageUrls,SelectImages){
    const { height } = Dimensions.get('window');
    const {width} = Dimensions.get("window");
    if (_.isEmpty(imageUrls)) {
        return (
            <Pressable onPress = {()=>SelectImages(imageUrls, setImageUrls)} style = {{justifyContent:'center', alignItems:'center'}}>
                <View style = {{height:height/2, width:width, backgroundColor:'whitesmoke', justifyContent:'center', alignItems:'center'}}>
                    <Ionicons name ='images-outline' size = {80} color = {'lightgray'}/>
                </View>
            </Pressable>
        )
    }
    return (
        <Pressable onPress = {()=>SelectImages(imageUrls, setImageUrls)} style = {{justifyContent:'center', alignItems:'center'}}>
            <View style = {{width:70, backgroundColor:'black', height:70, borderRadius:40, justifyContent:'center', alignItems:'center', marginTop:20}}>
                <Ionicons name ='add-outline' size = {40} color = {'white'}/>
            </View>
        </Pressable>
    )
}