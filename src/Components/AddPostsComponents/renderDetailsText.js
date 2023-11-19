import {View} from 'react-native';
import {CustomTextInput} from '../CustomText';
import React from 'react';


export default function RenderDetailsText({category, setDetails}) {
  if ((category === 'Homes' || category === 'Auto')) {
    return null;
  }
  return (
    <View>
      <CustomTextInput
        placeholder="Details"
        onChangeText={(text) => setDetails(text)}
        multiline
        height={200}
      />
    </View>
  );
}
