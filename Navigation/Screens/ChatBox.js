import { Bubble, GiftedChat} from 'react-native-gifted-chat';
import faker from 'faker';
import * as React from 'react';
import { View,Text, Pressable, Image, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Components/Firebase'
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';

faker.seed(10);

export default function ChatBox({route, navigation}) {
  const [messages, setMessages] = React.useState([]);

  const getMessages = async () => {
    const results =[]
    try {
      const QueryData = await firestore.collection(`Chats/${route.params.conversationID}/messages`).get();
      QueryData.forEach(async doc => {
        const data = doc.data();
        results.push({
          _id: data._id,
          text: data.text,
          createdAt: new Date(data.createdAt),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
          },
        });
      });
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
    
    results.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

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
    const messagesRef = firestore.collection('Chats/'+ route.params.conversationID + "/messages");
    const title= uuidv4();
    const mappedMessage = {
      _id:title,
      createdAt: new Date().toString(),
      text:message[0].text,
      user:{
        _id:route.params.userId,
        name:route.params.username,
        avatar:route.params.avatar 
      }
    }
    
    messagesRef.add(mappedMessage)

    setMessages(lastMessage => GiftedChat.append(lastMessage,  mappedMessage))
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



  return (  
    <SafeAreaView style={{flex:1}}>
      <View style={{marginLeft:10, flexDirection:'row'}}>
        <View style={{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:10}}>
            <Pressable onPress={()=>navigation.goBack()}>
                <Ionicons name='arrow-back-outline' size={30}/>
            </Pressable>
        </View>

        <View style={{ backgroundColor: 'transparent', flexDirection:'row', alignItems:'center'}}>
          <Image style={{height:40, width:40, borderRadius:100}} source={{uri:route.params.avatar}}/>
          <Text style={{fontWeight:'bold', margin:10, fontSize:15}}>{route.params.name}</Text>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        alwaysShowSend
        isTyping = {true}
        scrollToBottom
        user={{_id:route.params.userId}}
        renderBubble={renderBubble}
      />
  </SafeAreaView> 
  )
}