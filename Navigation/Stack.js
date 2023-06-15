import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainContainer from './MainContainer';
import PostDetails from './Screens/PostDetails';
import Chatbox from './Screens/ChatBox';
import Categories from './Screens/Categories';
import ViewProfile from './Screens/ViewProfile';
import EditPost from './Screens/EditPosts';
import ViewImages from './Screens/ImageViewer';
import CheckOut from './Screens/CheckOut';
import ResetPassword from "./Screens/ResetPassword";
import EditProfile from "./Screens/EditProfile";
import ConnectedWallets from "./Screens/ConnectedWallets";
import DeletedPosts from "./Screens/DeletedPosts";
import Reviews from "./Screens/Reviews";
import WriteReview from "./Screens/WriteReview";
import Map from "./Screens/Map";
import TermsOfService from "./Screens/TermsOfService";
import HomeMapView from "./Screens/HomeMapView";
// screenOptions= {{headerShown:false}}

const Stack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initaialRouteName ="Login" screenOptions= {{headerShown:false}}>
      <Stack.Screen name ="Login" component= {Login}/>
      <Stack.Screen name ="Main Container" component= {MainContainer}/>
      <Stack.Screen name ="Sign Up" component = {SignUp}/>
      <Stack.Screen name ="post details" component = {PostDetails}/>
      <Stack.Screen name ="chat box" component = {Chatbox} />
      <Stack.Screen name ="categories" component = {Categories} />
      <Stack.Screen name ="view profile" component = {ViewProfile} />
      <Stack.Screen name ="Edit Post" component = {EditPost} />
      <Stack.Screen name ="Image Viewer" component = {ViewImages} />
      <Stack.Screen name ="Check Out" component = {CheckOut} />
      <Stack.Screen name ="Reset Password" component = {ResetPassword} />
      <Stack.Screen name ="Edit Profile" component = {EditProfile} />
      <Stack.Screen name ="Connected Wallets" component = {ConnectedWallets} />
      <Stack.Screen name ="Deleted Posts" component = {DeletedPosts} />
      <Stack.Screen name ="Reviews" component = {Reviews} />
      <Stack.Screen name ="Write Review" component = {WriteReview} />
      <Stack.Screen name ="Map" component = {Map} />
      <Stack.Screen name ="Terms of Service" component = {TermsOfService} />
      <Stack.Screen name ="Home Map View" component = {HomeMapView} />
    </Stack.Navigator>
  );
}

export default Stack;
