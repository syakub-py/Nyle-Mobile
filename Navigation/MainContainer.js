import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


//Screens
import home from './Screens/Home'
import wallet from './Screens/Wallet'
import chat from './Screens/Chat'
import profile from './Screens/Profile'
import addPost from './Screens/AddPost';

const Home = 'Home';
const Wallet = 'Wallet';
const AddPost ='Add Post';
const Chat = 'Chat';
const Profile = 'Profile';


const Tab = createBottomTabNavigator();
export default function MainContainer({route}) {
    return (
        <Tab.Navigator initialRouteName = {home} 
        screenOptions = {({route}) => ({
          tabBarHideOnKeyboard:true,
          headerShown:false,
          tabBarActiveTintColor:"black",
          tabBarShowLabel:false,
          tabBarStyle:{
            height:50,
            borderRadius:15,
            position:'absolute',
            margin:15,
          },
          tabBarIcon: ({focused, color}) =>{
            let iconName;
            let rn = route.name;

            if (rn === Home){
              iconName = focused ? 'home' : 'home-outline';
            }else if (rn === Wallet){
              iconName = focused ? 'wallet' : 'wallet-outline';
            }else if (rn === Chat){
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }else if (rn === Profile){
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }else if (rn === AddPost){
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            return <Ionicons name = {iconName} size={30} color={color}/>
           },
           
        })}>
           
           <Tab.Screen name = {Home} component = {home} initialParams={{ username: route.params.username }}/>
           <Tab.Screen name = {Wallet} component = {wallet}/>
           <Tab.Screen name = {AddPost} component = {addPost} initialParams={{ username: route.params.username }}/>
           <Tab.Screen name = {Chat} component = {chat} initialParams={{ username: route.params.username }}/>
           <Tab.Screen name = {Profile} component = {profile} initialParams={{ username: route.params.username }}/>
        </Tab.Navigator>
    );
  }
  