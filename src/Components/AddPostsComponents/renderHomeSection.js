import {View} from 'react-native';
import {CustomTextWithInput} from '../CustomText';
import React from 'react';


export default function RenderHomeDataSection({category, setBedrooms, setBathrooms, setSQFT}) {
  if (category !== 'Homes') return <View/>;
  return (
    <View>
      <CustomTextWithInput text="Bedrooms" onChangeText={(text) => setBedrooms(text)} multiline />
      <CustomTextWithInput text="Bathrooms" onChangeText={(text) => setBathrooms(text)} multiline />
      <CustomTextWithInput text="Square footage" onChangeText={(text) => setSQFT(text)} multiline />
    </View>
  );
}
