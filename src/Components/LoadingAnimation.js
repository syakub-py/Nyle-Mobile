import {ActivityIndicator, View} from 'react-native';
import React from 'react';


export function loadingAnimation(loading) {
  if (loading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size = "large" color = "black" />
      </View>
    );
  }
}
