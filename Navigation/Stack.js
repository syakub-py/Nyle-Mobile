import Login from './Screens/Login';
import Home from './Screens/Home';
import SignUp from './Screens/SignUp';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainContainer from './MainContainer';
import PostDetails from './Screens/PostDetails';
import Chatbox from './Screens/ChatBox';
import Categories from './Screens/Categories';
import ViewProfile from './Screens/ViewProfile';
// screenOptions={{headerShown:false}}
const Stack = () =>{
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initaialRouteName="Login" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Main Container" component={MainContainer}/>
          <Stack.Screen name="Sign Up" component = {SignUp}/>
          <Stack.Screen name="post details" component = {PostDetails}/>
          <Stack.Screen name="chat box" component = {Chatbox} />
          <Stack.Screen name="categories" component = {Categories} />
          <Stack.Screen name="view profile" component = {ViewProfile} />
        </Stack.Navigator>
      );
  }

export default Stack;