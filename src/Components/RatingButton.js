import {Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext} from 'react';
import _ from 'lodash';
import {UserContext} from '../Contexts/UserContext';
import {useNavigation} from '@react-navigation/native';

export default function RatingButton({username}) {
  const {rating} = useContext(UserContext);
  const navigation = useNavigation();
  if (_.isUndefined(rating)) {
    return null;
  }
  return (
    <Pressable onPress = {() => {
      navigation.navigate('Reviews', {username: username});
    }}>
      <View style = {{flexDirection: 'column', alignItems: 'center'}}>
        <Ionicons size = {20} name = {'star'} color = {'#ebd61e'}/>
        <Text style = {{fontSize: 17, fontWeight: 'bold', paddingRight: 5}}>{rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}
