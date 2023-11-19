import React from 'react';
import {Text, TextInput, View} from 'react-native';




export const CustomTextInput = ({placeholder, onChangeText, multiline = false, height = 50, value, width = null}) => {
  return (
    <TextInput
      multiline = {multiline}
      value = {value}
      placeholder={placeholder}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
      }}
      placeholderTextColor="#A9A9A9"
      underlineColorAndroid="gray"
      selectionColor="#000"
      onChangeText = {onChangeText}
    />
  );
};

