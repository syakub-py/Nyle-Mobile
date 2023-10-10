import React from 'react';
import {Text, TextInput, View} from 'react-native';

export const CustomText = ({text}) => {
  return (
    <Text style = {{fontSize: 25, fontWeight: 'bold', color: 'black', margin: 10}}>
      {text}
    </Text>
  );
};


export const CustomTextInput = ({onChangeText, multiline = false, height = 50, value, width = null}) => {
  return (
    <TextInput
      multiline = {multiline}
      value = {value}
      style = {{backgroundColor: 'whitesmoke', marginLeft: 35, marginRight: 35, fontSize: 15, height: height, borderRadius: 10, paddingHorizontal: 15, width: width}}
      onChangeText = {onChangeText}
    />
  );
};

export const CustomTextWithInput = ({text, onChangeText, multiline = false, height=50, value}) => {
  return (
    <View>
      <CustomText text = {text} />
      <CustomTextInput onChangeText = {onChangeText} multiline = {multiline} height = {height} value = {value} />
    </View>
  );
};
