import { GiftedChat} from 'react-native-gifted-chat';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore, getstorage} from '../Components/Firebase';
import {v4 as uuidv4} from 'uuid';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import * as ImagePicker from 'expo-image-picker';
import _ from 'lodash';
import {getProfilePicture, getUsername} from './GlobalFunctions';
import {loadingAnimation} from '../Components/LoadingAnimation';
import RenderBubble from '../Components/ChatBoxComponents/renderBubble';
import RenderIsAnimating from '../Components/ChatBoxComponents/renderIsAnimating';
import RenderActions from '../Components/ChatBoxComponents/renderActions';
import RenderInputToolbar from '../Components/ChatBoxComponents/renderInputToolbar';

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
  const [state, setState] = useState({active: 0});
  const [animating, setAnimating] = useState(false);
  let downloadUrls =[];
  let [messages] = useCollectionData(messagesRef);
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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
  }, []);
  loadingAnimation(loading);

  if (messages) {
    messages = messages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  const onSend = useCallback(async (message, params) => {
    const messagesRef = firestore.collection('Chats/'+ params.conversationID + '/messages');
    const title = uuidv4();

    downloadUrls = await upload(imageUrls, params.conversationID);

    const mappedMessage = {
      _id: title,
      createdAt: new Date().toString(),
      text: message[0].text,
      image: downloadUrls,
      sent: true,
      received: false,
      user: {
        _id: params.userId,
        name: username,
        avatar: profilePic,
      },
    };
    setImageUrls([]);
    messagesRef.add(mappedMessage);
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

  const change = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
    if (slide !== state.active) setState({active: slide});
  };

  useEffect(() => {
    clearMessages(messagesRef);
    markAsRead(route.params.userId, username);
  }, []);


  const isStateActiveCSS = (state, k) => {
    if (k === state.active) return {color: 'white', margin: 4, fontSize: 10};
    return {color: '#a8a5a5', margin: 4, fontSize: 7};
  };

  return (
    <SafeAreaView style = {{flex: 1}}>
      <View style = {{marginLeft: 10, flexDirection: 'row'}}>
        <View style = {{height: 50, width: 50, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
          <Pressable onPress = {() =>navigation.goBack()}>
            <Ionicons name ='arrow-back-outline' size = {35}/>
          </Pressable>
        </View>

        <View style = {{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
          <Image style = {{height: 45, width: 45, borderRadius: 15}} source = {{uri: route.params.otherAvatar}}/>
          <Text style = {{fontWeight: 'bold', margin: 10, fontSize: 16}}>{username}</Text>
        </View>
      </View>

      <GiftedChat
        messages = {messages}
        onSend = {(messages) => onSend(messages, route.params)}
        alwaysShowSend
        scrollToBottom
        user = {{_id: route.params.userId}}
        renderBubble = {()=><RenderBubble imageUrls={imageUrls}/>}
        renderActions = {()=><RenderActions imageUrls={imageUrls} setImageUrls={setImageUrls}/>}
        renderInputToolbar = {()=><RenderInputToolbar imageUrls={imageUrls} setImageUrls={setImageUrls} animating={animating} />}
        renderMessageImage = {(props) => {
          if (_.isEmpty(props.currentMessage.image)) return <View/>;
          else {
            return (
              <View style = {{width: 200, height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
                <Pressable onLongPress= {() =>navigation.navigate('Image Viewer', {pictures: props.currentMessage.image})}>
                  <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false} pagingEnabled = {true} onScroll = {change} style = {{width: 200, height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
                    {
                      props.currentMessage.image.map((image, index) => {
                        return (
                          <Image
                            key = {index}
                            source = {{uri: image}}
                            style = {{
                              width: 200,
                              height: 200,
                              borderRadius: 15,
                            }}
                            resizeMode = "cover"
                          />
                        );
                      })}
                  </ScrollView>
                  <View style = {{flexDirection: 'row', position: 'absolute', bottom: 0, alignSelf: 'center', alignItems: 'center'}}>
                    {
                      props.currentMessage.image.map((i, k) => (
                        <Text style = {isStateActiveCSS(state, k)} key = {k}>⬤</Text>
                      ))
                    }
                  </View>
                </Pressable>
              </View>
            );
          }
        }
        }
      />
    </SafeAreaView>
  );
}
