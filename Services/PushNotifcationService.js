import messaging from '@react-native-firebase/messaging';

export const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) await messaging().getToken()
};

export const handleIncomingNotification = () => {
    messaging().onMessage(async (remoteMessage) => {
        console.log('Received a new notification', remoteMessage);
        // Handle the notification according to your app's logic
    });
};

export const PushNotification = (message) => {
    messaging()
        .getToken()
        .then((token) => {
            const notification = {
                token: token,
                notification: {
                    title: 'New Message',
                    body: message,
                },
            };

            return messaging().sendMessage(notification);
        })
        .then(() => {
            console.log('Notification sent successfully!');
        })
        .catch((error) => {
            console.log('Error sending notification:', error);
        });
};
