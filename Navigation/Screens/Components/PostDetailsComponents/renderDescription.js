import _ from "lodash";
import {Text, View} from "react-native";
import React from "react";

export default function RenderDescription(description, more, setMore){
    if (!_.isEmpty(description)){
        return(
            <View style = {{marginBottom:20}}>
                <Text style = {{marginRight:30, marginLeft:30, color:'black', fontSize:15}} onPress = {() =>setMore(true)}>{(more &&  !_.isEmpty( description)) ?  description :  description.slice(0, 500) + " ..."}</Text>
            </View>
        )
    }else{
        return (
            <View/>
        )
    }
}