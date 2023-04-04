import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import * as React from 'react';
import { View,Text, Pressable, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore} from './Components/Firebase'
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useCollectionData} from "react-firebase-hooks/firestore"
import * as ImagePicker from 'expo-image-picker';


export default function ChatBox({route, navigation}) {
  const messagesRef = firestore.collection(`Chats/${route.params.conversationID}/messages`);
  let [messages] = useCollectionData(messagesRef)
  const [imageUrls, setImageUrls] = React.useState([]);

  if (messages){
    messages = messages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  const renderActions = () => (
      <View style={{justifyContent:'center', alignItems:'center', margin:7}}>
        <Pressable onPress={SelectImages}>
          <Ionicons name='images' size={25}/>
        </Pressable>
      </View>    
  );
  
  const deleteImages = (index) =>{
    const newArray = imageUrls
    newArray.splice(index, 1)
    setImageUrls(newArray)
  }

  const SelectImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true
    });
  
    if (!result.canceled) {
        const currentImageUrls = [...imageUrls];
        const fileJson = result.assets;
        fileJson.forEach((element)=>{
            currentImageUrls.push(element.uri)
        })
        setImageUrls(currentImageUrls);
    };  
  }

  const onSend = React.useCallback((message)  => {
    const messagesRef = firestore.collection('Chats/'+ route.params.conversationID + "/messages");
    const title = uuidv4();
    const mappedMessage = {
      _id:title,
      createdAt: new Date().toString(),
      text:message[0].text,
      image: imageUrls,
      user:{
        _id:route.params.userId,
        name:route.params.username,
        avatar:route.params.otherAvatar 
      }
    }
    setImageUrls([])
    messagesRef.add(mappedMessage)
  }, [])

  const renderBubble = (props) => {
    const wrapperStyle = {
      right: {
        backgroundColor: 'black',
        borderWidth: 3,
        borderRadius: 18,
        ...(imageUrls.length > 0 && { marginBottom: 90 }),
      },
    };
    return (
      <Bubble
        {...props}
        wrapperStyle={wrapperStyle}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };
  
  
  const renderSend = () =>{
    return(
      <TouchableOpacity onPress={onSend}>
        <View style={{backgroundColor:'black', padding:11, borderRadius:20, margin:5}}>
          <Ionicons name={'send-outline'} size={15} color={'white'}/>
        </View>
      </TouchableOpacity>
    )
  };

  const renderInputToolbar = (props) => {
    return (
      <View style={{flex:1 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            position: 'absolute',
            bottom: 55,
            left: 0,
            right: 0,
            height: 75,
          }}>
          {
            (imageUrls.length > 0) ? (
              imageUrls.map((value, index) => (
                <View key={index} style={{backgroundColor:'#F0F0F0'}}>
                  <Pressable style={{zIndex:1}}>
                    <View style={{backgroundColor: 'red', height: 20, width: 20,borderRadius: 20, position: 'absolute', left: 3,top: 0, alignItems: 'center',justifyContent: 'center'}}>
                      <Ionicons name='close-outline'  color={'white'} size={15} style={{elevation:1}}/>
                    </View>
                  </Pressable>
                  <Image
                    source={{ uri: value }}
                    style={{ width: 70, height: 70, borderRadius: 15, marginLeft: 10 }}
                  />
                </View>
              ))
            ) : (
              <View>

              </View>
            )
          }
        </ScrollView>
        <View style={{ flex: 1 }}>
          <InputToolbar
            {...props}
            primaryStyle={{
              borderTopColor: '#E0E0E0',
              backgroundColor: '#F0F0F0',
              paddingHorizontal: 5,
              paddingTop: 5,
              paddingBottom:5
            }}
          />
        </View>
      </View>
    );
  };

  return (  
    <SafeAreaView style={{flex:1}}>
      <View style={{marginLeft:10, flexDirection:'row'}}>
        <View style={{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:10}}>
            <Pressable onPress={()=>navigation.goBack()}>
                <Ionicons name='arrow-back-outline' size={35}/>
            </Pressable>
        </View>

        <View style={{ backgroundColor: 'transparent', flexDirection:'row', alignItems:'center'}}>
          <Image style={{height:45, width:45, borderRadius:100}} source={{uri:route.params.avatar}}/>
          <Text style={{fontWeight:'bold', margin:10, fontSize:16}}>{route.params.name}</Text>
        </View>
      </View>

      <GiftedChat
        inverted 
        messages={messages}
        onSend={messages => onSend(messages)}
        alwaysShowSend
        scrollToBottom
        user={{_id:route.params.userId}}
        renderBubble={renderBubble}
        renderActions={renderActions}
        // renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderMessageImage={(props) => (
          <Image
            source={{ uri: props.currentMessage.image }}
            style={{ width: 200, height: 200 }}
            resizeMode="cover"
          />
        )}
      />
  </SafeAreaView> 
  )
}