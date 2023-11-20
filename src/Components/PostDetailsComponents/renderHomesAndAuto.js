import {Text, View} from 'react-native';
import React from 'react';
import usePostContext from '../../Services/UsePostContext';


export default function RenderHomesAndAuto({postTitle}) {
  const item = usePostContext(postTitle);
  if (!(item.category !== 'Homes' && item.category !== 'Auto')) return <View></View>;
  return (
    <Text style = {{marginRight: 30, marginLeft: 30, color: '#a8a5a5', fontSize: 15}}>{item.details}</Text>
  );
}
