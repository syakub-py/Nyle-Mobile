import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

export default function RenderIsLiked(Liked){
    if (Liked) return <Ionicons name ='heart' size = {30} color = {'#e6121d'}/>
    return <Ionicons name ='heart-outline' size = {30}/>
}