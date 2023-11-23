import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back-outline" size={30} />
    </Pressable>
  );
}
