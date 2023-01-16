import { Bubble, GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import faker from 'faker';
import * as React from 'react';
import { View,Text, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestoreLite} from './Components/Firebase'
import {collection, getDocs} from 'firebase/firestore/lite'


faker.seed(10);

export default function ChatBox({route}) {
  const [messages, setMessages] = React.useState([]);
  // console.log("Users/"+route.params.username+"/Conversations/Rico.Kuphal@hotmail.com/Messages")

  const getMessages = async () =>{
    const results =[];
    const messageCollection = collection(firestoreLite, "Users/"+route.params.username+"/Conversations/Rico.Kuphal@hotmail.com/Messages");
    const messageSnapshot = await getDocs(messageCollection);
    messageSnapshot.forEach(doc => {
      results.push(doc.data())
    });
    return results;
  }

  React.useEffect(() => {
    getMessages().then((result) =>{
      setMessages([result])
    }).catch((error)=>{
      console.log(error)
    })
  }, [])

  const onSend = React.useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
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
    user={
        {
        _id: 1,
        avatar: "https://my-user-photo.jpg"
        }
    } 
      alwaysShowSend
      scrollToBottom
      renderBubble={renderBubble}
      renderSend = {renderSendBar}
    />

  )
}