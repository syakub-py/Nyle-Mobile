import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import usePostContext from '../../Services/UsePostContext';

export default function RenderIsCategoryHomes({postTitle}) {
  const postContext = usePostContext(postTitle);
  if (postContext.category === 'Homes') {
    return (
      <View style = {{flexDirection: 'row', alignContent: 'center', marginTop: 5}}>
        <View style = {{flexDirection: 'row', alignContent: 'center'}}>
          <Ionicons name = {'bed'} color = {'black'} size = {20}/>
          <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{postContext.bedrooms}</Text>
        </View>

        <View style = {{flexDirection: 'row', alignContent: 'center'}}>
          <Ionicons name = {'water'} color = {'black'} size = {20}/>
          <Text style = {{fontSize: 15, color: 'black', marginRight: 10}}>{postContext.bathrooms}</Text>
        </View>
        <View style = {{flexDirection: 'row', alignContent: 'center'}}>
          <Ionicons name = {'expand'} color = {'black'} size = {20}/>
          <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{postContext.SQFT}</Text>
        </View>

      </View>
    );
  }
}
