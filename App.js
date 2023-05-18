import { NavigationContainer } from '@react-navigation/native';
import Stack from './Navigation/Stack';
// import { requestNotificationPermission, handleIncomingNotification } from'./PushNotifcationService';
import * as React from 'react';


export default function App() {
    // React.useEffect(() => {
    //     requestNotificationPermission().then(() => {
    //         console.log("Requested Permission")
    //     });
    //     handleIncomingNotification();
    // }, []);

    return (
    <NavigationContainer>
      <Stack/>
    </NavigationContainer>
  );
}