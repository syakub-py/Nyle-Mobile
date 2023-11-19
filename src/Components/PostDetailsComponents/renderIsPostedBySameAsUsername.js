import {Alert, Image, Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useEffect, useState} from 'react';
import {firestore} from '../Firebase';
import {UserContext} from '../../Contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import {getProfilePicture} from '../../Screens/GlobalFunctions';


export const generateChatID = (user1, user2) => {
  const sortedUsers = [user1, user2].sort();

  return `${sortedUsers[0]}_${sortedUsers[1]}`;
};

const handleAddChat = (params, navigation) => {
  const currentUser = params.username;
  const otherUser = params.item.postedBy;

  const chatID = [currentUser, otherUser].sort().join('_');

  firestore
      .collection('Chats')
      .doc(chatID)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          navigation.navigate('chat box', {
            username: currentUser,
            conversationID: chatID,
            name: otherUser,
            avatar: params.CurrentUserProfilePic,
            otherAvatar: params.item.profilePic,
            userId: generateChatID(currentUser, otherUser),
          });
        } else {
          firestore
              .collection('Chats')
              .doc(chatID)
              .set({
                owners: [
                  {
                    profilePic: params.CurrentUserProfilePic,
                    username: currentUser,
                  },
                  {
                    profilePic: params.item.profilePic,
                    username: otherUser,
                  },
                ],
              })
              .then(() => {
                navigation.navigate('chat box', {
                  username: currentUser,
                  conversationID: chatID,
                  name: otherUser,
                  avatar: params.CurrentUserProfilePic,
                  otherAvatar: params.item.profilePic,
                  userId: generateChatID(currentUser, otherUser),
                });
              })
              .catch((error) => {
                Alert.alert('Error adding document: ', error);
              });
        }
      })
      .catch((error) => {
        Alert.alert('Error checking for existing chat: ', error);
      });
};


export default function PostedBySameAsUsername({postedBy, numOfReviews}) {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  const [postedByProfilePicture, setPostedByProfilePicture] = useState('');
  useEffect(()=>{
    getProfilePicture(postedBy).then((result)=>{
      setPostedByProfilePicture(result);
    });
    userContext.generateRating();
  }, []);


  if (postedBy !== userContext.username) {
    return (
      <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style = {{justifyContent: 'center', flexDirection: 'row', marginLeft: 10}}>
          <Image source = {{uri: postedByProfilePicture}} style = {{height: 60, width: 60, borderRadius: 10, alignSelf: 'center'}}/>
          <View style = {{margin: 10, alignSelf: 'center'}}>
            <Text style = {{fontWeight: 'bold', color: 'black'}}>{postedBy}</Text>
            <Text style = {{fontWeight: 'bold', color: 'lightgrey'}}>Owner</Text>
            <Pressable onPress = {() => {
              navigation.navigate('Reviews', {username: postedBy, currentUser: userContext.username});
            }}>
              <View style = {{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginTop: 2,
              }}>
                <Ionicons name = "star" style = {{marginRight: 3}} color = "#ebd61e" size = {13} />
                <Text style = {{fontSize: 12, fontWeight: 'bold'}}>{userContext.rating.toFixed(1)}</Text>
                <Text style = {{fontSize: 10, color: 'grey', marginLeft: 3}}>({numOfReviews} reviews)</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* <Pressable onPress = {()=>handleAddChat(params, navigation)}> */}
        <View style = {{height: 60, width: 60, borderRadius: 15, backgroundColor: '#292929', elevation: 10, margin: 10}}>
          <Ionicons name = "chatbox-ellipses-outline" color = {'white'} size = {30} style = {{margin: 15}}/>
        </View>
        {/* </Pressable> */}
      </View>
    );
  }

  return (
    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{justifyContent: 'center', flexDirection: 'row', margin: 10}}>
        <Image source = {{uri: userContext.profilePicture}} style = {{height: 60, width: 60, borderRadius: 10, alignSelf: 'center'}}/>
        <View style = {{margin: 10, alignSelf: 'center'}}>
          <Text style = {{fontWeight: 'bold', color: 'black'}}>{postedBy} (You)</Text>
          <Text style = {{fontWeight: 'bold', color: 'lightgrey'}}>Owner</Text>
          <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
            <Ionicons name = {'star'} style = {{marginRight: 3}} color = {'#ebd61e'} size = {13}/>
            <Text style = {{fontSize: 12, fontWeight: 'bold'}}>{userContext.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
