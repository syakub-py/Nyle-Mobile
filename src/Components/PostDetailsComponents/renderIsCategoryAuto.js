import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import usePostContext from '../../Services/UsePostContext';

export default function RenderIsCategoryAuto({postTitle}) {
  const postContext = usePostContext(postTitle);
  if (postContext.category === 'Auto') {
    return (
      <View style = {{flexDirection: 'column'}}>
        <View style = {{flexDirection: 'row', alignContent: 'center', marginTop: 5}}>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'car-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{postContext.mileage}</Text>
          </View>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'information-circle-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{postContext.Vin}</Text>
          </View>

        </View>
        <View style = {{flexDirection: 'row', alignContent: 'center', marginTop: 5}}>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'hammer-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{postContext.make}</Text>
          </View>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'information-circle-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{postContext.model}</Text>
          </View>

        </View>
      </View>
    );
  }
}
