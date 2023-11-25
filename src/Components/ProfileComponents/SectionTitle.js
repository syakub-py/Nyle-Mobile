import {Text, View} from 'react-native';
import React from 'react';

export default function SectionTitle({title}) {
  return (
    <View style = {{marginTop: 20, marginLeft: 10}}>
      <Text style = {{color: 'black', fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
    </View>
  );
};
