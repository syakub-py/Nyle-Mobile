import { Bubble, GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import faker from 'faker';
import * as React from 'react';
import { View,Text, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Components/Firebase'
import { v4 as uuidv4 } from 'uuid';


faker.seed(10);

export default function ChatBox({route}) {
  const [messages, setMessages] = React.useState([]);
  // console.log("Users/"+route.params.username+"/Conversations/Rico.Kuphal@hotmail.com/Messages")

  const getAllDocs = async () =>{
    const docs = [];
    const snapShot = await firestore.collection('Chats').get()
    snapShot.forEach(doc => {
      docs.push({ id: doc.id, data:doc.data()});
    });
     return docs;
  }


  const getMessages = async () => {
    const results =[]
    try {
      const result = await getAllDocs();
      for (const doc of result) {
        const QueryData = await firestore.collection(`Chats/${doc.id}/messages`).get();
        QueryData.forEach(async doc => {
          const data = doc.data();
          results.push({
            _id: data._id,
            text: data.text,
            createdAt: data.CreatedAt,
            user: {
              _id: 2,
              name: data.username,
              avatar: data.profilePic
            },
          });
        });
      }
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
    return results;
  };
  

  React.useEffect(() => {
    getMessages().then((result) =>{
      setMessages(result)
    }).catch((error)=>{
      console.log(error)
    })
  }, [])

  const onSend = React.useCallback( async (message)  => {
    const messagesRef = firestore.collection('Chats/'+ route.params.messageID + "/messages");
    const title= uuidv4();
    messagesRef.doc(title).set({
      text: message.text,
      createdAt: message.createdAt,
      userName: route.params.username,
    })
    // messages.forEach(message => {
    //   newMessages.push({
    //     text: message.text,
    //     createdAt: message.createdAt,
    //     userId: message.user._id,
    //     userName: message.user.name,
    //   });
    // });
    //setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  const renderBubble = (props) =>{
    return(
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: 'black',
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
        },
      }}
      />
    )
  }

  const renderSendBar = (props) => {
    return (
      <Send {...props}>
        <View>
          <Ionicons name='arrow-forward-circle-outline' size={38} style ={{color: "blue"}}/>
        </View>
      </Send>
    );
  };

  return (   
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      alwaysShowSend
      scrollToBottom
      renderBubble={renderBubble}
      renderSend = {renderSendBar}
    />

  )
}