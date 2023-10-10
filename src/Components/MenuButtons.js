import {
  Pressable,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function MenuButton({title, onPress, iconName, style}) {
  return (
    <Pressable onPress={onPress}>
      <View style={style}>
        <Ionicons name={iconName} size={25} color={'black'}/>
        <Text>{title}</Text>
      </View>
    </Pressable>
  );
}
