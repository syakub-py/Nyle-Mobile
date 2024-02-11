import _ from 'lodash';
import {View} from 'react-native';
import IsAnimating from './IsAnimating';
import React from 'react';

export default function ImageUrls({imageUrls, setImageUrls, animating}) {
  if (_.isEmpty(imageUrls)) return <View/>;

  return (
    imageUrls.map((value, index) => (
      <View key = {index} style = {{backgroundColor: '#F0F0F0'}}>
        <IsAnimating value={value} index={index} animating={animating} imageUrls={imageUrls} setImageUrls={setImageUrls}/>
      </View>
    ))
  );
};
