import {Text, View} from 'react-native';
import React from 'react';
import findPost from '../../Services/FindPost';


export default function HomesAndAuto({postId}) {
  const item = findPost(postId);
  if (!(item.category !== 'Homes' && item.category !== 'Auto')) return <View></View>;
  return (
    <Text style = {{marginRight: 30, marginLeft: 30, color: '#a8a5a5', fontSize: 15}}>{item.details}</Text>
  );
}
