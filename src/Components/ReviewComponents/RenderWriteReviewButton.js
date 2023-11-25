import {Pressable, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function RenderWriteReviewButton({username, PostedByUsername}){
  const navigation = useNavigation();
  if (username === PostedByUsername) return null;
  return (
    <View style = {{
      position: 'absolute',
      bottom: 16,
      right: 16,
    }}>
      <Pressable style = {{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
      }} onPress = {() => navigation.navigate('Write Review', {PostedBy: PostedByUsername})}>
        <Ionicons name = "pencil" size = {24} color = "white" />
      </Pressable>

    </View>
  );
};
