import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';


export default function BackButton({navigation}) {
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back-outline" size={30} />
    </Pressable>
  );
}
