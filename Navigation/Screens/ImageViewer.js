import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Pressable, View} from "react-native";
import React from "react";


export default function ViewImages({route, navigation}){
    const images = route.params.pictures;
    const getImages = (array) =>{
        const result = []
        array.map((image)=>{
            result.push({url: image})
        })
        return result
    }

    return (
        <ImageViewer 
        imageUrls={getImages(images)}
        enableSwipeDown={true}
        renderHeader={()=>(
            <View style={{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                <Pressable onPress={()=> {navigation.goBack()}}>
                    <Ionicons name='close-outline' size={30}/>
                </Pressable>
            </View>
        )}
        onSwipeDown={() => {navigation.goBack()}}
        index={route.params.index}
        backgroundColor='transparent'
        />
    );
}