import {ActivityIndicator, Image, Pressable, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';



const deleteImages = (index, imageUrls, setImageUrls) => {
  const newArray = imageUrls.filter((_, i) => i !== index);
  setImageUrls(newArray);
};

export default function RenderIsAnimating({value, index, animating, imageUrls, setImageUrls}) {
  if (animating) {
    return (
      <View>
        <View style = {{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
          <ActivityIndicator size = "large" color = "black" />
        </View>
        <Image
          source = {{uri: value}}
          style = {{width: 70, height: 70, borderRadius: 15, marginLeft: 10}}
        />
      </View>
    );
  } else {
    return (
      <View>
        <Pressable style = {{zIndex: 1}} onPress = {() =>deleteImages(index, imageUrls, setImageUrls)}>
          <View style = {{backgroundColor: 'red', height: 20, width: 20, borderRadius: 20, position: 'absolute', left: 3, top: 0, alignItems: 'center', justifyContent: 'center'}}>
            <Ionicons name ='remove-outline' color = {'white'} size = {15} style = {{elevation: 1}}/>
          </View>
        </Pressable>
        <Image
          source = {{uri: value}}
          style = {{width: 70, height: 70, borderRadius: 15, marginLeft: 10}}
        />
      </View>
    );
  }
};
