import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Pressable,Dimensions, ScrollView } from 'react-native';
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function ReviewCard({data}){
    return(
        <View style={{ marginBottom: 10, margin: 10}}>

            <View style={{ flexDirection: "row"}}>

                <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} />
                <View style={{ flexDirection: "column" }}>
                    <Text style={{marginLeft:5}}>{data.Reviewer}</Text>
                    <Text style={{marginLeft:5, fontWeight:'bold'}}>{data.Title}</Text>
                    <View style={{ flexDirection: "row", marginLeft:5}}>
                        {
                            Array.from({ length: data.stars }, (_, index) => (
                                <Ionicons key={index} size={17} name={"star"} color={"#ebd61e"} />
                            ))
                        }
                    </View>
                </View>
            </View>

            <View>
                <Text style={{marginTop:5}}>{data.ReviewMessage}</Text>
            </View>

        </View>
    )
}