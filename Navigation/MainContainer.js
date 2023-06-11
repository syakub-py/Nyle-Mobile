import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Screens/Components/Firebase'
import {Image, View} from "react-native";
//Screens
import home from './Screens/Home'
import market from './Screens/Market'
import chat from './Screens/Chat'
import profile from './Screens/Profile'
import addPost from './Screens/AddPost';

const Home= 'Home';
const Market= 'Market';
const AddPost='Add Post';
const Chat= 'Chat';
const Profile= 'Profile';


const Tab = createBottomTabNavigator();
export default function MainContainer({route}) {
    const profilePic= "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const [received,setReceived] = React.useState(true)

    const MyChatQuery = firestore.collection('Chats');

    MyChatQuery.get().then(async (ChatSnapshot) => {
        for (const doc of ChatSnapshot.docs) {
            for (let i = 0; i < doc.data().owners.length; i++) {
                if (doc.data().owners[i].username === route.params.username) {
                    const latestMessageQuery = firestore.collection(`Chats/${doc.id}/messages`)
                        .orderBy('createdAt', 'desc')
                        .limit(1);
                    latestMessageQuery.onSnapshot((latestMessageSnapshot) => {
                        if (!latestMessageSnapshot.empty && latestMessageSnapshot.docs[0].data().user.name !== route.params.username) {
                            const latestMessage = latestMessageSnapshot.docs[0].data();
                            setReceived(latestMessage.received)
                        }
                    })
                }
            }
        }
    });
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
          tabBarIcon: ({focused, color}) =>{

            let iconName;
            let rn = route.name;
            if (rn === Home){
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name = {iconName} size={32} color={color}/>
            }else if (rn === Market){
              iconName = focused ? 'analytics' : 'analytics-outline';
              return <Ionicons name = {iconName} size={32} color={color}/>
            }else if (rn === Chat){
              iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
              if (received === false){
                  return(
                      <View>
                          <View style={{backgroundColor:'red', height:13, width:13, borderRadius:10, elevation:2,zIndex:1, position:'absolute', left:0, top:0}}/>
                          <Ionicons name = {iconName} size={32} color={color}/>
                      </View>
                  )
              }else {
                  return(
                      <Ionicons name = {iconName} size={32} color={color}/>
                  )
              }
            }else if (rn === Profile){
                return <Image source={{uri: profilePic}} style={focused?{height:37, width:37, borderRadius:20, borderWidth:2}:{height:32, width:32, borderRadius:20}}/>
            }else if (rn === AddPost){
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              return <Ionicons name = {iconName} size={32} color={color}/>
            }
           },

        })}>

           <Tab.Screen name = {Home} component = {home} initialParams={{ username:route.params.username, profilePicture:profilePic}}/>
           <Tab.Screen name = {Market} component = {market}/>
           <Tab.Screen name = {AddPost} component = {addPost} initialParams={{ username: route.params.username , profilePicture:profilePic}}/>
           <Tab.Screen name = {Chat} component = {chat} initialParams={{ username: route.params.username }}/>
           <Tab.Screen name = {Profile} component = {profile} initialParams={{ username: route.params.username, profilePicture:profilePic}}/>

        </Tab.Navigator>
    );
  }
