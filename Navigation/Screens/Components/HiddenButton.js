import {TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";


export default function HiddenButton({iconName, color,onPress}){
    return(
            <TouchableOpacity onPress = {onPress} style={{marginRight:15}}>
                <Ionicons size = {30} name ={iconName} color = {color}/>
            </TouchableOpacity>
    )
}