import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import * as React from 'react';
import {
    View,
    Text,
    Pressable,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Dimensions,
    ProgressBarAndroid
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore, getstorage} from './Components/Firebase'
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useCollectionData} from "react-firebase-hooks/firestore"
import * as ImagePicker from 'expo-image-picker';

export default function ChatBox({route, navigation}) {
  const messagesRef = firestore.collection(`Chats/${route.params.conversationID}/messages`);
  let [messages] = useCollectionData(messagesRef)
  const [imageUrls, setImageUrls] = React.useState([]);
  const [refresh, setRefreshing] = React.useState(false);
  let downloadUrls =[]
  const [state, setState] = React.useState({active:0})
  const [indeterminate, setIndeterminate] = React.useState(false);
  const {width} = Dimensions.get("window");

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
    onRefresh();
  }
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1);
  };

  const SelectImages = async () => {
      let result= await ImagePicker.launchImageLibraryAsync({
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
    }
  }

    const onSend = React.useCallback(async (message)=> {
        const messagesRef = firestore.collection('Chats/'+ route.params.conversationID + "/messages");
        const title = uuidv4();

        downloadUrls = await upload(imageUrls);

        const mappedMessage = {
            _id:title,
            createdAt: new Date().toString(),
            text:message[0].text,
            image: downloadUrls,
            sent : true,
            received : false,
            user:{
                _id:route.params.userId,
                name:route.params.username,
                avatar:route.params.otherAvatar
            }
        }
        setImageUrls([])
        messagesRef.add(mappedMessage)
    }, [imageUrls])


    const renderBubble = (props) => {
        const wrapperStyle = {
            right: {
                backgroundColor: 'black',
                borderWidth: 3,
                borderRadius: 18,
                ...(imageUrls.length > 0 && { marginBottom: 90 }),
            },
            left:{
                backgroundColor:'#ebebeb',
                borderWidth: 3,
                borderRadius: 18,
                borderColor:'#ebebeb',
                ...(imageUrls.length > 0 && { marginBottom: 90 }),
            }
        };

        return (
            <Bubble
                {...props}
                wrapperStyle={wrapperStyle}
                textStyle={{
                    right: {
                        color: '#fff',
                        flexWrap: 'wrap'
                    },
                    left: {
                        flexWrap: 'wrap'
                    }
                }}/>
        );
    };

    const upload = async (array) => {
    const UrlDownloads = [];
    if (array.length> 0){
        try {
            setIndeterminate(true)
            for (const element of array) {
                const filename = element.split("/").pop();
                const response = await fetch(element);
                const blob = await response.blob();
                const storageRef = getstorage.ref().child(`MessageImages/${route.params.conversationID}/${filename}`);
                await storageRef.put(blob);
                console.log("Image uploaded successfully!");
                const url = await storageRef.getDownloadURL();
                UrlDownloads.push(url);
            }
            console.log("All images uploaded successfully!");
            setIndeterminate(false)
            return UrlDownloads;
        } catch (error) {
            console.error(error);
            return [];
        }
    }else{
        return [];
    }
  };


    const change = ({nativeEvent}) =>{
        const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
        if(slide !== state.active){
            setState({active: slide})
        }
    }

    const markAsRead =async () =>{
        const unreadMessagesRef = firestore.collection('Chats/'+ route.params.conversationID + "/messages").where("received", "==", false);
        await unreadMessagesRef.get().then((docs)=>{
            docs.forEach((doc) =>{
                const currentMessageData = doc.data()
                if (currentMessageData.user.name !== route.params.username){
                    doc.ref.update({received: true})
                }
            })
        })
    }

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
          }}
          refreshControl={<RefreshControl refreshing ={refresh} onRefresh={onRefresh}/>}>
          {
            (imageUrls.length > 0) ? (
              imageUrls.map((value, index) => (
                <View key={index} style={{backgroundColor:'#F0F0F0', elevation:2}}>
                  <Pressable style={{zIndex:1}} onPress={()=>deleteImages(index)}>
                    <View style={{backgroundColor: 'red', height: 20, width: 20,borderRadius: 20, position: 'absolute', left: 3,top: 0, alignItems: 'center',justifyContent: 'center'}}>
                      <Ionicons name='remove-outline'  color={'white'} size={15} style={{elevation:1}}/>
                    </View>
                  </Pressable>
                  <Image
                    source={{ uri: value }}
                    style={{ width: 70, height: 70, borderRadius: 15, marginLeft: 10}}
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

    React.useEffect(()=>{
        markAsRead().then(()=>{
            console.log("updating unread messages...")
        })
    },[])

  return (  
    <SafeAreaView style={{flex:1}}>
      <View style={{marginLeft:10, flexDirection:'row'}}>
        <View style={{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:10}}>
            <Pressable onPress={()=>navigation.goBack()}>
                <Ionicons name='arrow-back-outline' size={35}/>
            </Pressable>
        </View>

        <View style={{ backgroundColor: 'transparent', flexDirection:'row', alignItems:'center'}}>
          <Image style={{height:45, width:45, borderRadius:15}} source={{uri:route.params.avatar}}/>
          <Text style={{fontWeight:'bold', margin:10, fontSize:16}}>{route.params.name}</Text>
        </View>
      </View>

        {
            (indeterminate)?(
                <View>
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={indeterminate}
                        style={{
                            width: width,
                            height: 10,
                            marginTop: 5,
                            marginBottom: 10,
                        }}
                        color="black"
                    />
                </View>
            ):(
                <View>

                </View>
            )
        }


      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        alwaysShowSend
        scrollToBottom
        user={{_id:route.params.userId}}
        renderBubble={renderBubble}
        renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderMessageImage={(props) => {
            if (props.currentMessage.image.length > 0) {
                return (
                    <View style={{width: 200, height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
                        <Pressable onPress={()=>navigation.navigate("Image Viewer", {pictures:props.currentMessage.image})}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} onScroll={change} style={{ width: 200,  height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
                                {
                                    props.currentMessage.image.map((image, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                source={{uri: image}}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                    borderRadius:15
                                                }}
                                                resizeMode="cover"
                                            />
                                        );
                                    })}
                            </ScrollView>
                            <View style = {{flexDirection:'row', position:'absolute', bottom:0, alignSelf:'center', alignItems:'center'}}>
                                {
                                    props.currentMessage.image.map((i, k)=>(
                                        <Text style={k==state.active?{color:'white', margin:4, fontSize:10}:{color:'#a8a5a5', margin:4, fontSize:7}} key={k}>⬤</Text>
                                    ))
                                }
                            </View>
                        </Pressable>
                    </View>
                );
            }else {
                return (
                    <View>

                    </View>
                )
            }
        }
      }
      />
  </SafeAreaView> 
  )
}