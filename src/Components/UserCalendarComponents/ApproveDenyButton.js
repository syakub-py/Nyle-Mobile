import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";


export default function ApproveDenyButton({onPress, iconName, color}){
    return(
        <TouchableOpacity onPress = {onPress} style={{alignItems:'center', justifyContent:'center', marginRight:15, borderWidth:1, borderColor:'lightgray', borderRadius:20, height:40, width:40}}>
            <Ionicons name = {iconName} color = {color} size = {30} />
        </TouchableOpacity>
    )
}