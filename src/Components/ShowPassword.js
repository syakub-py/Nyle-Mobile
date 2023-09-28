import {Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
const getIsVisibleIcon = (visible) =>{
    if (!visible){
        return "eye-outline"
    }
    return "eye-off-outline"
}
export default function ShowPassword({visible, setVisible}){
    return(
        <View style={{flexDirection:'row', alignItems:'center', marginTop:4}}>
            <Ionicons
                name={getIsVisibleIcon(visible)}
                size={20}
                style={{marginRight:5}}
                onPress={() => setVisible(!visible)}
            />
            <Text>Show Password</Text>
        </View>
    )
}