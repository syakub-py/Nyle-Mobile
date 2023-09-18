import {Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";


export default function renderIsCategoryHomes(item){
    if (item.category === "Homes") {
        return (
            <View style = {{flexDirection:"row", alignContent:'center', marginTop:5}}>
                <View style = {{flexDirection:"row", alignContent:'center'}}>
                    <Ionicons name = {'bed'} color = {'black'} size = {20}/>
                    <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.bedrooms}</Text>
                </View>

                <View style = {{flexDirection:"row", alignContent:'center'}}>
                    <Ionicons name = {'water'} color = {'black'} size = {20}/>
                    <Text style = {{fontSize:15, color:'black', marginRight:10}}>{item.bathrooms}</Text>
                </View>
                <View style = {{flexDirection:"row", alignContent:'center'}}>
                    <Ionicons name = {'expand'} color = {'black'} size = {20}/>
                    <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.SQFT}</Text>
                </View>

            </View>
        )
    }
}