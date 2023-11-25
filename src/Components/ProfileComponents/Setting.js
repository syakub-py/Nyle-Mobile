import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function Setting({title, nameOfIcon, type, onPress}){
  if (type !== 'button') return <View/>;
  else {
    return (
      <TouchableOpacity style = {{flexDirection: 'row', height: 50, alignItems: 'center', width: '100%', marginLeft: 20}} onPress = {onPress}>
        <View style = {{flexDirection: 'row'}}>
          <Ionicons name = {nameOfIcon} style = {{color: 'black', marginRight: 20}} size = {25}/>
          <Text style = {{flex: 1, color: 'black', fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};
