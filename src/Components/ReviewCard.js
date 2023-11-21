import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Firebase';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getProfileOtherPicture} from '../Screens/GlobalFunctions';
import HiddenButton from './HiddenButton';
import {UserContext} from '../Contexts/UserContext';

const sendReply = async (data, currentUser, reply, existingReplies, setExistingReplies) => {
  const docRef = firestore.collection('Reviews').doc(data.id);
  const doc = await docRef.get();

  if (doc.exists) {
    setExistingReplies(doc.data().Replies || []);

    const newReply = {
      username: currentUser,
      message: reply,
      datePosted: new Date(),
    };

    setExistingReplies([...existingReplies, newReply]);
    const updatedReplies = [...existingReplies, newReply];
    await docRef.update({Replies: updatedReplies});
  }
};

const deleteReply = async (data, existingReplies, setExistingReplies, index) => {
  const docRef = firestore.collection('Reviews').doc(data.id);
  const doc = await docRef.get();

  if (doc.exists) {
    const updatedReplies = existingReplies.filter((_, i) => i !== index);
    setExistingReplies(updatedReplies);

    await docRef.update({Replies: updatedReplies});
  }
};


/*
    @param data = {DatePosted:TimeStamp ,Replies: [{datePosted, message, username (posted by username)}, id:string (id of the doc in firestore), stars: int (number of stars)]
 */

export default function ReviewCard({data}) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [existingReplies, setExistingReplies] = useState(data.Replies);
  const [profilePic, setProfilePic] = useState(null);
  const {username} = useContext(UserContext);

  useEffect(()=>{
    getProfileOtherPicture(data.Reviewer).then((result)=>{
      setProfilePic(result);
    });
  }, []);

  const handleSendReply = () => {
    sendReply(data, username, reply, existingReplies, setExistingReplies);
    setOpen(!open);
  };

  const handleDeleteReply = (index) => {
    deleteReply(data, existingReplies, setExistingReplies, index);
  };

  const renderIsRevieweCurrentUser = () => {
    if (data.Reviewe !== username) return <View/>;
    return (
      <Pressable onPress = {() =>setOpen(!open)}>
        <View style = {{position: 'absolute', bottom: 0, right: 10}}>
          <Ionicons name = {'arrow-redo-outline'} size = {20}/>
        </View>
      </Pressable>
    );
  };

  const RenderIsWriteReplyOpen = () => {
    if (!open) {
      return renderIsRevieweCurrentUser();
    }
    return (
      <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
        <View style = {{width: 300}}>
          <TextInput multiline placeholder = {'Write a reply'} onChangeText = {(text) =>setReply(text)}/>
        </View>

        <Pressable onPress = {handleSendReply}>
          <View style = {{backgroundColor: 'black', justifyContent: 'center', borderRadius: 30}}>
            <Ionicons name = {'send'} size = {15} color = {'white'} style = {{margin: 7}}/>
          </View>
        </Pressable>

      </View>
    );
  };

  const RenderIsRevieweCurrentUser2 = () => {
    if (data.Reviewe !== username) {
      return (
        <ScrollView>
          {
            existingReplies.map((reply, index) =>(
              <View key = {index} style = {{marginLeft: 30, marginTop: 5}}>
                <Text style = {{fontWeight: 'bold'}}>{reply.username} </Text>
                <Text>{reply.message}</Text>
              </View>
            ))
          }
        </ScrollView>
      );
    }
    return (
      <SwipeListView
        data = {existingReplies}
        rightOpenValue = {-60}
        renderItem = {({item, index}) =>(
          <View key = {index} style = {{marginLeft: 30, marginTop: 5, backgroundColor: 'whitesmoke'}}>
            <Text style = {{fontWeight: 'bold'}}>{item.username} (You)</Text>
            <Text>{item.message}</Text>
          </View>
        )}
        renderHiddenItem = {({item, index}) => (
          <View style={{position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center'}}>
            <HiddenButton iconName={'trash-outline'} color={'red'} onPress={()=>{
              handleDeleteReply(index);
            }}/>
          </View>
        )}
      />
    );
  };

  return (
    <View style = {{marginBottom: 10, margin: 10, backgroundColor: 'whitesmoke'}}>

      <View>
        <View style = {{flexDirection: 'row'}}>
          <Image style = {{height: 50, width: 50, borderRadius: 50}} source = {{uri: profilePic}} />
          <View style = {{flexDirection: 'column'}}>
            <Text style = {{marginLeft: 5}}>{data.Reviewer}</Text>
            <Text style = {{marginLeft: 5, fontWeight: 'bold'}}>{data.Title}</Text>
            <View style = {{flexDirection: 'row', marginLeft: 5}}>
              {
                Array.from({length: data.stars}, (_, index) => (
                  <Ionicons key = {index} size = {17} name = {'star'} color = {'#ebd61e'} />
                ))
              }
            </View>
          </View>
        </View>

        <View style = {{paddingBottom: 10}}>
          <Text style = {{marginTop: 5}}>{data.ReviewMessage}</Text>
        </View>

        <RenderIsWriteReplyOpen/>

      </View>

      <RenderIsRevieweCurrentUser2/>
    </View>
  );
}
