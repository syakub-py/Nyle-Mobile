import {View} from 'react-native';
import {CustomTextInput} from '../CustomText';
import React from 'react';


export default function RenderHomeDataSection({category, setBedrooms, setBathrooms, setSQFT}) {
  if (category !== 'Homes') return null;
  return (
    <View>
      <CustomTextInput placeholder="Bedrooms" onChangeText={(text) => setBedrooms(text)} multiline />
      <CustomTextInput placeholder="Bathrooms" onChangeText={(text) => setBathrooms(text)} multiline />
      <CustomTextInput placeholder="Square footage" onChangeText={(text) => setSQFT(text)} multiline />
    </View>
  );
}
