import {Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import _ from 'lodash';


export default function RatingButton({navigation, rating, username, currentUsername}) {
  if (!_.isUndefined(rating)) {
    return (
      <Pressable onPress = {() => {
        navigation.navigate('Reviews', {username: username, currentUser: currentUsername});
      }}>
        <View style = {{flexDirection: 'column', alignItems: 'center'}}>
          <Ionicons size = {20} name = {'star'} color = {'#ebd61e'}/>
          <Text style = {{fontSize: 17, fontWeight: 'bold', paddingRight: 5}}>{rating.toFixed(1)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View/>
  );
}
