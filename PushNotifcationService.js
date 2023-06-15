import messaging from '@react-native-firebase/messaging';

export const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) await messaging().getToken()
};

//This isn't being used:
export const handleIncomingNotification = () => {
    messaging().onMessage(async (remoteMessage) => {
        console.log('Received a new notification', remoteMessage);
        // Handle the notification according to your app's logic
    });
};
