import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Screens/Components/Firebase'
import { Image, View} from "react-native";
import {getProfilePicture} from "./Screens/GlobalFunctions";
//Screens
import home from './Screens/Home'
import market from './Screens/Market'
import chat from './Screens/Chat'
import profile from './Screens/Profile'
import addPost from './Screens/AddPost';
import _ from "lodash";

const Home = 'Home';
const Market = 'Market';
const AddPost = 'Add Post';
const Chat = 'Chat';
const Profile = 'Profile';

const Tab = createBottomTabNavigator();

export default function MainContainer({route}) {
  const [received, setReceived] = useState(true)
  const [profilePic, setProfilePic] = useState(null)
  const [eventSeen, setEventSeen] = useState(true)

  useEffect(()=>{
    getProfilePicture(route.params.username).then((result)=>{
      setProfilePic(result)
    })
  },[])


  const MyChatQuery = firestore.collection('Chats');

  MyChatQuery.get().then((ChatSnapshot) => {
    const latestMessagePromises = [];

    ChatSnapshot.docs.forEach((doc) => {
      const owner = doc.data().owners.find((owner) => owner.username === route.params.username);
      if (owner) {
        const latestMessageQuery = firestore.collection(`Chats/${doc.id}/messages`)
            .orderBy('createdAt', 'desc')
            .limit(1);
        latestMessagePromises.push(latestMessageQuery.get());
      }
    });

    Promise.all(latestMessagePromises).then((results) => {
      results.forEach((latestMessageSnapshot) => {
        if (!latestMessageSnapshot.empty && latestMessageSnapshot.docs[0].data().user.name !== route.params.username) {
          const latestMessage = latestMessageSnapshot.docs[0].data();
          setReceived(latestMessage.received);
        }
      });
    });
  });


  const today = new Date().toISOString().split('T')[0];
  const MyEventsQuery = firestore.collection('CalendarEvents').where("seller","==", route.params.username).where("startTime","==", today);
  MyEventsQuery.get().then((eventsSnapshot) =>{
    eventsSnapshot.forEach((doc)=>{
      if (!doc.data().seen){
        setEventSeen(false)
      }
    })
  })

  return (
    <Tab.Navigator initialRouteName = {home}
    screenOptions = {({route}) => ({
      tabBarHideOnKeyboard:true,
      headerShown:false,
      tabBarActiveTintColor:"black",
      tabBarShowLabel:false,

      tabBarStyle: {
        height: 60,
        borderRadius:20,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
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
        let rn = route.name;
        if (rn === Home) {
          iconName = focused ? 'home' : 'home-outline';
          return <Ionicons name = {iconName} size = {32} color = {color}/>
        } else if (rn === Market) {
          iconName = focused ? 'analytics' : 'analytics-outline';
          return <Ionicons name = {iconName} size = {32} color = {color}/>
        } else if (rn === Chat) {
          iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
          if (received) return <Ionicons name = {iconName} size = {32} color = {color}/>
          else {
            return (
              <View>
                <View style = {{backgroundColor:'red', height:15, width:15, borderRadius:10, elevation:2,zIndex:1, position:'absolute', left:0, top:0}}/>
                <Ionicons name = {iconName} size = {32} color = {color}/>
              </View>
            )
          }
        } else if (rn === Profile && !_.isEmpty(profilePic)) {
          if (eventSeen){
            return <Image source = {{uri: profilePic}} style = {focused?{height:37, width:37, borderRadius:20, borderWidth:2}:{height:32, width:32, borderRadius:20}}/>
          }else{
            return (
                <View>
                  <View style = {{backgroundColor:'red', height:15, width:15, borderRadius:10, elevation:2,zIndex:1, position:'absolute', left:0, top:0, alignItems:'center', justifyContent:'center'}}>
                    <Ionicons name = {"calendar-outline"} size = {10} color = {"white"}/>
                  </View>
                  <Image source = {{uri: profilePic}} style = {focused?{height:37, width:37, borderRadius:20, borderWidth:2}:{height:32, width:32, borderRadius:20}}/>
                </View>
            )
          }

        } else if (rn === AddPost) {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          return <Ionicons name = {iconName} size = {32} color = {color}/>
        }
        },

    })}>

        <Tab.Screen name = {Home} component = {home} initialParams = {{ username:route.params.username}}/>
        <Tab.Screen name = {Market} component = {market}/>
        <Tab.Screen name = {AddPost} component = {addPost} initialParams = {{ username: route.params.username }}/>
        <Tab.Screen name = {Chat} component = {chat} initialParams = {{ username: route.params.username}}/>
        <Tab.Screen name = {Profile} component = {profile} initialParams = {{ username: route.params.username}}/>

    </Tab.Navigator>
  );
}
