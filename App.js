import { NavigationContainer } from '@react-navigation/native';
import Stack from './Navigation/Stack';
import React, {useState, useEffect} from 'react';

export default function App() {
  return (
  <NavigationContainer>
    <Stack/>
  </NavigationContainer>
  );
}
