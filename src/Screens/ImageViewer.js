import ImageViewer from 'react-native-image-zoom-viewer';
import React from 'react';

/*
    @route.params = {index: index to start, pictures: array of urls to show}
*/

const getImages = (array) => {
  return array.map((image) => ({url: image}));
};

export default function ViewImages({route, navigation}) {
  const {pictures, index} = route.params;

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
