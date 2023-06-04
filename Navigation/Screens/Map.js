import MapView, { Marker, Circle } from 'react-native-maps';
import React from 'react';
import {View, Text, Image, Dimensions, ScrollView, Pressable, Alert, SafeAreaView} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";



export default function Map({route, navigation}){
    return(
        <View style={{flex:1}}>
            <View style={{zIndex:1}}>
                <View style={{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                    <Pressable onPress={()=>navigation.goBack()}>
                        <Ionicons name='chevron-back-outline' size={30}/>
                    </Pressable>
                </View>
            </View>
            <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: route.params.coordinates, pitch: 0,heading:0,zoom: 12, altitude:0}} >
                <Marker coordinate={route.params.coordinates}/>
                <Circle
                    center={route.params.coordinates}
                    radius={1200}
                    fillColor="rgba(255, 0, 0, 0.2)"
                    strokeColor="rgba(255, 0, 0, 0.7)"
                    strokeWidth={1}
                />
            </MapView>
        </View>
    )
}