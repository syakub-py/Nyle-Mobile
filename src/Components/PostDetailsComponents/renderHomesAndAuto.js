import {Text, View} from 'react-native';
import React from 'react';


export default function RenderHomesAndAuto({item}) {
  if (!(item.category !== 'Homes' && item.category !== 'Auto')) return <View></View>;
  return (
    <View>
      <Text style = {{marginRight: 30, marginLeft: 30, color: '#a8a5a5', fontSize: 15}}>{item.details}</Text>
    </View>
  );
}
