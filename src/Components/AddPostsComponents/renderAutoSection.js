import {View} from 'react-native';
import {CustomTextInput} from '../CustomText';
import React from 'react';


export default function RenderAutoSection({category, setMake, setModel, setMileage, setVIN}) {
  if (category !== 'Auto') {
    return null;
  }

  return (
    <View>
      <CustomTextInput placeholder="Make" onChangeText={(text) => setMake(text)} />
      <CustomTextInput placeholder="Model" onChangeText={(text) => setModel(text)} />
      <CustomTextInput placeholder="Mileage" onChangeText={(text) => setMileage(text)} />
      <CustomTextInput placeholder="VIN" onChangeText={(text) => setVIN(text)} />
    </View>
  );
}
