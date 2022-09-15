import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import {NavigationContainer, TabActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import home from './Screens/Home'
import wallet from './Screens/Wallet'
import chat from './Screens/Chat'
import profile from './Screens/Profile'


const Home = 'Home';
const Wallet = 'Wallet';
const Chat = 'Chat'
const Profile = 'Profile';


const Tab = createBottomTabNavigator();
export default function MainContainer() {
    return (
        <Tab.Navigator initialRouteName = {home}
        screenOptions = {({route}) => ({
          tabBarIcon: ({focused, color, size}) =>{
            let iconName;
            let rn = route.name;

            if (rn === Home){
              iconName = focused ? 'home' : 'home-outline';
            }else if (rn === Wallet){
              iconName = focused ? 'wallet' : 'wallet-outline';
            }else if (rn === Chat){
              iconName = focused ? 'chatbox' : 'chatbox-outline';
            }else if (rn === Profile){
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            return <Ionicons name = {iconName}/>
           },
        })}>
           

           <Tab.Screen name = {Home} component = {home}/>
           <Tab.Screen name = {Wallet} component = {wallet}/>
           <Tab.Screen name = {Chat} component = {chat}/>
           <Tab.Screen name = {Profile} component = {profile}/>

        </Tab.Navigator>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });