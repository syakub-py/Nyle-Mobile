import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Stack from './src/Stack';

/**
 * Main App component.
 *
 * @return {React.JSX.Element} The rendered component.
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack />
    </NavigationContainer>
  );
}
