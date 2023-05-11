import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from "./Screens/Components/Firebase";

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
    const [profilePic, setProfilePic] = React.useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

    const getProfilePic = React.useCallback(async () => {
        const profilePictureQuery = firestore
            .collection("ProfilePictures")
            .where("FileName", "==", route.params.username.toLowerCase());
        try {
            const result = await profilePictureQuery.get();
            const profilePicUrls = result.docs.map((doc) => doc.data().url);
            const url = profilePicUrls.length > 0
                ? profilePicUrls[0]
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
            setProfilePic(url);
            return url;
        } catch (error) {
            console.error("Error getting profile picture:", error);
            const url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
            setProfilePic(url);
            return url;
        }
    }, [route.params.username, setProfilePic]);

    React.useEffect(() => {
        getProfilePic().then(r => {
            console.log(r)
        });
    }, []);


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
            }else if (rn === Market){
              iconName = focused ? 'analytics' : 'analytics-outline';
            }else if (rn === Chat){
              iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
            }else if (rn === Profile){
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }else if (rn === AddPost){
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            return <Ionicons name = {iconName} size={32} color={color}/>
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
