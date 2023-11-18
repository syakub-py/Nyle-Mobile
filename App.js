import React, {useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Stack from './src/Stack';
import {AppContext, NyleContext} from './src/Contexts/NyleContext';

/**
 * Main App component.
 *
 * @return {React.JSX.Element} The rendered component.
 */
export default function App() {
  const nyleContext = useMemo(()=>new NyleContext(), []);
  return (
    <AppContext.Provider value={nyleContext}>
      <NavigationContainer>
        <Stack />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
