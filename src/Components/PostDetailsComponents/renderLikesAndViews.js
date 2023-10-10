import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';


export default function LikesAndViews({data, iconName, color}) {
  return (
    <View style = {{
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderRadius: 5,
      alignItems: 'center',
    }}>
      <Ionicons name ={iconName} size = {20} color = {color}/>
      <Text style = {{
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 3,
        marginRight: 5,

      }}>{data}</Text>
    </View>
  );
}
