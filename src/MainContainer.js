import _ from 'lodash';
import React, {useState, useEffect, useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Components/Firebase';
import {Image, View} from 'react-native';
import home from './Screens/Home';
import market from './Screens/Market';
import chat from './Screens/Chat';
import profile from './Screens/Profile';
import addPost from './Screens/AddPost';
import {UserContext} from './Contexts/UserContext';

const Home = 'Home';
const Market = 'Market';
const AddPost = 'Add Post';
const Chat = 'Chat';
const Profile = 'Profile';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  const [received, setReceived] = useState(true);
  const userContext = useContext(UserContext);

  useEffect(() => {
    userContext.initializeUserData().then(()=>{});
  }, []);

  const MyChatQuery = firestore.collection('Chats');

  MyChatQuery.get().then((ChatSnapshot) => {
    const latestMessagePromises = [];

    ChatSnapshot.docs.forEach((doc) => {
      const owner = doc.data().owners.find((owner) => owner.username === userContext.username);
      if (owner) {
        const latestMessageQuery = firestore
            .collection(`Chats/${doc.id}/messages`)
            .orderBy('createdAt', 'desc')
            .limit(1);
        latestMessagePromises.push(latestMessageQuery.get());
      }
    });

    Promise.all(latestMessagePromises).then((results) => {
      results.forEach((latestMessageSnapshot) => {
        if (!latestMessageSnapshot.empty &&
            latestMessageSnapshot.docs[0].data().user.name !== userContext.username) {
          const latestMessage = latestMessageSnapshot.docs[0].data();
          setReceived(latestMessage.received);
        }
      });
    });
  });

  return (
    <Tab.Navigator initialRouteName = {home}
      screenOptions = {({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          borderRadius: 20,
          backgroundColor: 'white',
          position: 'absolute',
          bottom: '3%',
          left: '5%',
          right: '5%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarIcon: ({focused, color}) => {
          let iconName;
          const rn = route.name;
          if (rn === Home) {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name = {iconName} size = {32} color = {color}/>;
          } else if (rn === Market) {
            iconName = focused ? 'analytics' : 'analytics-outline';
            return <Ionicons name = {iconName} size = {32} color = {color}/>;
          } else if (rn === Chat) {
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
            if (received) return <Ionicons name = {iconName} size = {32} color = {color}/>;
            else {
              return (
                <View>
                  <View style = {{backgroundColor: 'red', height: 15, width: 15, borderRadius: 10, elevation: 2, zIndex: 1, position: 'absolute', left: 0, top: 0}}/>
                  <Ionicons name = {iconName} size = {32} color = {color}/>
                </View>
              );
            }
          } else if (rn === Profile && !_.isEmpty(userContext.profilePicture)) {
            return <Image source={{uri: userContext.profilePicture}}
              style={focused ? {
                height: 37,
                width: 37,
                borderRadius: 20,
                borderWidth: 2,
              } : {
                height: 32,
                width: 32,
                borderRadius: 20,
              }}/>;
          } else if (rn === AddPost) {
            iconName = focused ? 'add' : 'add-outline';
            return (
              <View style={{backgroundColor: 'black', height: 60, width: 60, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 40, elevation: 2}}>
                <Ionicons name = {iconName} size = {40} color = {'white'}/>
              </View>
            );
          }
        },
      })}>
      <Tab.Screen name = {Home} component = {home}/>
      <Tab.Screen name = {Market} component = {market}/>
      <Tab.Screen
        name = {AddPost}
        component = {addPost}/>
      <Tab.Screen
        name = {Chat}
        component = {chat} />
      <Tab.Screen name = {Profile}
        component = {profile}/>

    </Tab.Navigator>
  );
}
