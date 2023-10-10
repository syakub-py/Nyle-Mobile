import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';


export default function RenderIsCategoryAuto({item}) {
  if (item.category === 'Auto') {
    return (
      <View style = {{flexDirection: 'column'}}>
        <View style = {{flexDirection: 'row', alignContent: 'center', marginTop: 5}}>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'car-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{item.mileage}</Text>
          </View>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'information-circle-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{item.Vin}</Text>
          </View>

        </View>
        <View style = {{flexDirection: 'row', alignContent: 'center', marginTop: 5}}>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'hammer-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{item.make}</Text>
          </View>

          <View style = {{flexDirection: 'row', alignContent: 'center'}}>
            <Ionicons name = {'information-circle-outline'} color = {'black'} size = {20}/>
            <Text style = {{fontSize: 15, color: 'black', marginRight: 10, marginLeft: 5}}>{item.model}</Text>
          </View>

        </View>
      </View>
    );
  }
}
