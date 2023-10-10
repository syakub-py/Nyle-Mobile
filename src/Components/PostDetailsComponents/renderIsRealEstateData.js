import {Text, View} from 'react-native';
import React from 'react';


export default function RealEstateData({item, realEstateData}) {
  if (realEstateData && realEstateData.length === 0 && item.category === 'Homes') {
    return (
      <View style = {{marginLeft: 30}}>
        <Text style = {{fontSize: 25, fontWeight: 'bold', color: 'black'}}>Public Records for {item.title}</Text>
        <Text style = {{fontSize: 15, color: 'lightgrey', marginTop: 5, marginBottom: 5}}>Beta only works in New York City</Text>
        <Text style = {{fontSize: 15, color: 'lightgrey', marginTop: 10}}>Nothing to show here</Text>
      </View>
    );
  }
}
