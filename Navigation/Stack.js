import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainContainer from './MainContainer';
import PostDetails from './Screens/postDetails';
import Chatbox from './Screens/ChatBox';
import Categories from './Screens/Categories';
import ViewProfile from './Screens/ViewProfile';
import EditPost from './Screens/EditPosts';
import ViewImages from './Screens/ImageViewer';
import CheckOut from './Screens/CheckOut';
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
          <Stack.Screen name="Edit Post" component = {EditPost} />
          <Stack.Screen name="Image Viewer" component = {ViewImages} />
          <Stack.Screen name="Check Out" component = {CheckOut} />
        </Stack.Navigator>
      );
  }

export default Stack;