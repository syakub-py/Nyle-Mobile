import messaging from '@react-native-firebase/messaging';

export const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
    }
};

export const handleIncomingNotification = () => {
    messaging().onMessage(async (remoteMessage) => {
        console.log('Received a new notification', remoteMessage);
        // Handle the notification according to your app's logic
    });
};