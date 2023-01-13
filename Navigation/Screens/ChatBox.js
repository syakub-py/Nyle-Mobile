import { Bubble, GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import faker from 'faker';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


faker.seed(10);

//https://stackoverflow.com/questions/60205950/how-to-customize-react-native-gifted-chat-in-react-native-0-61

export default function ChatBox() {
  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: faker.lorem.lines(1),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: faker.name.findName(),
          avatar: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
        },
      },
    ])
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

  // const messagesRef = firestore.collection('messages');
  // const query = messagesRef.orderBy('createdAt').limit(25);

  // await messagesRef.add({
  //   text: formValue,
  //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //   uid,
  //   photoURL
  // })

  return (   
    <GiftedChat
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{
      _id: 1,
      avatar: "https://my-user-photo.jpg"
    }}
      alwaysShowSend
      scrollToBottom
      renderBubble={renderBubble}
      renderSend = {renderSendBar}
    />

  )
}