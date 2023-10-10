import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function RenderIsLiked({Liked, size}) {
  if (Liked) return <Ionicons name ='heart' size = {size} color = {'#e6121d'}/>;
  return <Ionicons name ='heart-outline' size = {size}/>;
}
