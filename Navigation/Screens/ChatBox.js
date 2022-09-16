import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import faker from 'faker';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import Fire from "C:/Users/syaku/OneDrive/Documents/programs/JavaScript/NyleVS/Shared/Firebase"
//import { SafeAreaView } from 'react-native-safe-area-context';

faker.seed(10);

// export default class ChatBox extends React.Component{
//   state = {
//     messages: []
//   }
//   get user(){
//     return{
//       _id:Fire.uid,
//       name: this.props.navigation.state.params.name
//     }
//   }
//   componentDidMount(){
//     Fire.get(message => 
//       this.setState(previous =>{
//         messages: GiftedChat.append(previous.messages, message)
//     }));
//   }

//   componentWillUnmount(){
//     Fire.off();
//   }

//   render(){
//     const chat = <GiftedChat messages={this.state.messages} onSend={Fire.send} user={this.user}/>;
//     if (Platform.OS === 'android'){
//       return(
//         <KeyboardAvoidingView style = {{flex:1}} behavior ="padding" keyboardVerticalOffset={30} enabled>
//           {chat}
//         </KeyboardAvoidingView>
//       )
//     }
//     return(
//       <SafeAreaView style={{flex:1}}>{chat}</SafeAreaView>
//     )
//   }
// }








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
          backgroundColor: '#2e64e5',
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
    user={{
      _id: 1,
    }}
    alwaysShowSend
    scrollToBottom
    renderBubble={renderBubble}
    renderSend = {renderSendBar}
  />
  )
}