import {ActivityIndicator, View} from 'react-native';
import React from 'react';


export function LoadingAnimation({loading}) {
  if (!loading) {
    return null;
  }
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size = "large" color = "black" />
    </View>
  );
}
