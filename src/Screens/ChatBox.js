import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore, getstorage} from '../Components/Firebase';
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import {getProfilePicture, getUsername} from './GlobalFunctions';
import {loadingAnimation} from '../Components/LoadingAnimation';
import RenderBubble from '../Components/ChatBoxComponents/renderBubble';
import RenderActions from '../Components/ChatBoxComponents/renderActions';
import RenderInputToolbar from '../Components/ChatBoxComponents/renderInputToolbar';
import RenderMessageImage from '../Components/ChatBoxComponents/renderMessageImage';
import {GiftedChat} from 'react-native-gifted-chat';

const clearMessages = async (messagesRef) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const query = messagesRef.where('createdAt', '<', thirtyDaysAgo);

  return query.get().then((snapshot) => {
    const batch = firestore.batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  });
};

const markAsRead = async (conversationID, username) => {
  const unreadMessagesRef = firestore.collection('Chats/'+conversationID + '/messages').where('received', '==', false);
  await unreadMessagesRef.get().then((docs) => {
    docs.forEach((doc) => {
      const currentMessageData = doc.data();
      if (currentMessageData.user.name !== username) doc.ref.update({received: true});
    });
  });
};


/*
    @route.params = {avatar: url of the current users avatar, conversationID: id of the current conversation in firestore, name:name of the conversation, otherAvatar: url of the other users avatar, userId:the current users id in the conversation, username:the current username}
 */

export default function ChatBox({route, navigation}) {
  const conversationID = route.params.conversationID;
  const messagesRef = firestore.collection(`Chats/${conversationID}/messages`);

  const [imageUrls, setImageUrls] = useState([]);
  const [animating, setAnimating] = useState(false);
  let downloadUrls =[];
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  const wss = new WebSocket('ws://192.168.133.56:8080');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const profileName = await getUsername();
        setUsername(profileName);
        const pic = await getProfilePicture(profileName);
        setProfilePic(pic);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    wss.onopen = () => {
      console.log('Connected to the WebSocket');
    };

    wss.onerror = (error)=>{
      console.log('There was an error connecting to the web socket ' + error.message);
    };

    wss.onmessage = (event) => {
      console.log(`Message from server: ${event.data}`);

      const incomingMessage = JSON.parse(event.data);

      const formattedMessage = {
        _id: incomingMessage._id || uuidv4(),
        createdAt: new Date(incomingMessage.createdAt).toString(),
        text: incomingMessage.text,
        image: incomingMessage.image,
        sent: true,
        received: true,
        user: incomingMessage.user || {
          _id: incomingMessage.userId || 'unknownId',
          name: incomingMessage.username || 'unknownName',
          avatar: incomingMessage.profilePic || 'unknownAvatar',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, formattedMessage));
    };


    if (messages) {
      const sortedMessages = [...messages].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setMessages(sortedMessages);
    }

    clearMessages(messagesRef);
    markAsRead(route.params.userId, username);

    return () => {
      wss.onmessage = null;
      wss.onopen = null;
    };
  }, []);


  loadingAnimation(loading);

  const onSend = useCallback(async (message) => {
    const messagesRef = firestore.collection('Chats/'+ route.params.conversationID + '/messages');
    const title = uuidv4();

    downloadUrls = await upload(imageUrls, route.params.conversationID);

    const mappedMessage = {
      _id: title,
      createdAt: new Date().toString(),
      text: message[0].text,
      image: downloadUrls,
      sent: true,
      received: false,
      user: {
        _id: route.params.userId,
        name: username,
        avatar: profilePic,
      },
    };
    setImageUrls([]);
    messagesRef.add(mappedMessage);

    wss.send(JSON.stringify(mappedMessage));
  }, [imageUrls]);


  const upload = async (array, conversationID) => {
    const UrlDownloads = [];
    if (!_.isEmpty(array)) {
      try {
        setAnimating(true);
        for (const element of array) {
          const filename = element.split('/').pop();
          const response = await fetch(element);
          const blob = await response.blob();
          const storageRef = getstorage.ref().child(`MessageImages/${conversationID}/${filename}`);
          await storageRef.put(blob);
          const url = await storageRef.getDownloadURL();
          UrlDownloads.push(url);
        }
        setAnimating(false);
        return UrlDownloads;
      } catch (error) {
        console.error(error);
        return [];
      }
    } else return [];
  };

  return (
    <View style={{marginTop: 20}}>
      <View style = {{marginLeft: 10, flexDirection: 'row'}}>
        <View style = {{height: 50, width: 50, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
          <Pressable onPress = {() =>navigation.goBack()}>
            <Ionicons name ='arrow-back-outline' size = {35}/>
          </Pressable>
        </View>

        <View style = {{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
          <Image style = {{height: 45, width: 45, borderRadius: 15}} source = {{uri: route.params.otherAvatar}}/>
          <Text style = {{fontWeight: 'bold', margin: 10, fontSize: 16}}>{route.params.name}</Text>
        </View>
      </View>
      <GiftedChat
        messages = {messages}
        onSend = {(messages) => onSend(messages)}
        alwaysShowSend
        scrollToBottom
        user = {{_id: route.params.userId}}
        renderBubble={(props) => <RenderBubble {...props} imageUrls={imageUrls} />}
        renderActions = {()=><RenderActions imageUrls={imageUrls} setImageUrls={setImageUrls}/>}
        renderInputToolbar = {(props)=><RenderInputToolbar {...props} imageUrls={imageUrls} setImageUrls={setImageUrls} animating={animating} />}
        renderMessageImage = {(props) => <RenderMessageImage props={props}/>}
      />
    </View>
  );
}
