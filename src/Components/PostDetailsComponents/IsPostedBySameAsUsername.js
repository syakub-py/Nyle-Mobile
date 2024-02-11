import {Alert, Image, Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useEffect, useState} from 'react';
import {firestore} from '../Firebase';
import {UserContext} from '../../Contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import findPost from '../../Services/FindPost';
import {AppContext} from '../../Contexts/NyleContext';
import {LoadingAnimation} from '../LoadingAnimation';


export const generateChatID = (user1, user2) => {
  const sortedUsers = [user1, user2].sort();

  return `${sortedUsers[0]}_${sortedUsers[1]}`;
};


export default function PostedBySameAsUsername({postId}) {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  const post = findPost(postId);
  const nyleContext = useContext(AppContext);
  const [postedByProfilePicture, setPostedByProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [numberOfReviews, setNumberOfReviews] = useState(0);

  useEffect(()=>{
    setLoading(true);
    nyleContext.getProfileOtherPicture(post.postedBy).then((result)=>{
      setPostedByProfilePicture(result);
      setLoading(false);
    });
    nyleContext.generateOtherUsersRating(post.postedBy, setRating, setNumberOfReviews);
  }, []);

  const handleAddChat = () => {
    const currentUser = userContext.username;
    const otherUser = post.postedBy;
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
              avatar: userContext.profilePicture,
              otherAvatar: postedByProfilePicture,
              userId: generateChatID(currentUser, otherUser),
            });
          } else {
            firestore
                .collection('Chats')
                .doc(chatID)
                .set({
                  owners: [
                    {
                      profilePic: userContext.profilePicture,
                      username: currentUser,
                    },
                    {
                      profilePic: postedByProfilePicture,
                      username: otherUser,
                    },
                  ],
                })
                .then(() => {
                  navigation.navigate('chat box', {
                    username: currentUser,
                    conversationID: chatID,
                    name: otherUser,
                    avatar: userContext.profilePicture,
                    otherAvatar: postedByProfilePicture,
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

  if (post.postedBy !== userContext.username) {
    return (
      <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style = {{justifyContent: 'center', flexDirection: 'row', marginLeft: 10}}>
          {
            (loading)?(
              <LoadingAnimation loading={loading}/>
            ):(
              <Image source = {{uri: postedByProfilePicture}} style = {{height: 60, width: 60, borderRadius: 10, alignSelf: 'center'}}/>
            )
          }
          <View style = {{margin: 10, alignSelf: 'center'}}>
            <Text style = {{fontWeight: 'bold', color: 'black'}}>{post.postedBy}</Text>
            <Text style = {{fontWeight: 'bold', color: 'lightgrey'}}>Owner</Text>
            <Pressable onPress = {() => {
              navigation.navigate('Reviews', {username: post.postedBy});
            }}>
              <View style = {{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginTop: 2,
              }}>
                <Ionicons name = "star" style = {{marginRight: 3}} color = "#ebd61e" size = {13} />
                <Text style = {{fontSize: 12, fontWeight: 'bold'}}>{rating.toFixed(1)}</Text>
                <Text style = {{fontSize: 10, color: 'grey', marginLeft: 3}}>({numberOfReviews} reviews)</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <Pressable onPress = {()=>handleAddChat()}>
          <View style = {{height: 60, width: 60, borderRadius: 15, backgroundColor: '#292929', elevation: 10, margin: 10}}>
            <Ionicons name = "chatbox-ellipses-outline" color = {'white'} size = {30} style = {{margin: 15}}/>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{justifyContent: 'center', flexDirection: 'row', margin: 10}}>
        <Image source = {{uri: userContext.profilePicture}} style = {{height: 60, width: 60, borderRadius: 10, alignSelf: 'center'}}/>
        <View style = {{margin: 10, alignSelf: 'center'}}>
          <Text style = {{fontWeight: 'bold', color: 'black'}}>{post.postedBy} (You)</Text>
          <Text style = {{fontWeight: 'bold', color: 'lightgrey'}}>Owner</Text>
          <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
            <Ionicons name = {'star'} style = {{marginRight: 3}} color = {'#ebd61e'} size = {13}/>
            <Text style = {{fontSize: 12, fontWeight: 'bold'}}>{userContext.rating.toFixed(1)}</Text>
            <Text style = {{fontSize: 10, color: 'grey', marginLeft: 3}}>({userContext.numberOfReviews} reviews)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
