import ImageViewer from 'react-native-image-zoom-viewer';
import React from 'react';
import {useNavigation} from '@react-navigation/native';


const getImages = (array) => {
  return array.map((image) => ({url: image}));
};

export default function ViewImages({route}) {
  const {pictures, index} = route.params;
  const navigation = useNavigation();
  return (
    <ImageViewer
      imageUrls = {getImages(pictures)}
      enableSwipeDown = {true}
      onSwipeDown = {()=>{
        navigation.goBack();
      }}
      index = {index}
      backgroundColor = "transparent"
    />
  );
}
