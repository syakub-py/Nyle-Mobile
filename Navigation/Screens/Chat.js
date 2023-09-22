import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    RefreshControl,
    TextInput,
    Vibration,
} from 'react-native';
import {firestore, getstorage} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import _ from "lodash"
import {getProfilePicture} from "./GlobalFunctions";
import HiddenButton from "./Components/HiddenButton";
import ChatItem from "./Components/ChatComponents/ChatItem";

const onRefresh = async (setRefreshing, getChats, setFilterData, setMasterData, params) => {
    setRefreshing(true);
    await getChats(params, setFilterData, setMasterData)
    Vibration.vibrate(100);
    setTimeout(() => setRefreshing(false), 300);
};




const searchFilter = (text, masterData, setFilterData, setSearch) => {
    if (text) {
        const newData = masterData.filter((item) => {
            const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
            const textData = text.toUpperCase();
            return itemData.indexOf(textData)>-1;
        });
        setFilterData(newData);
        setSearch(text);
    } else {
        setFilterData(masterData);
        setSearch(text);
    }
}

// Delete a folder and all its contents
const deleteChat = async (chat, masterData, setMasterData) => {
    const docSnapshots = await firestore.collection('Chats').doc(chat.id).collection("messages").get();
    for (let doc of docSnapshots.docs) {
        if (!_.isEmpty(doc.data().image)) {
            for (let picture of doc.data().image) {
                let imageRef = getstorage.refFromURL(picture)
                await imageRef.delete()
            }
        }
    }
    setMasterData(masterData.filter((item) => item.id !== chat.id))
    await firestore.collection('Chats').doc(chat.id).delete();
}


const getChats = async (params, setFilterData, setMasterData) => {
    let results = [];
    try {
        const MyChatQuery = firestore.collection('Chats');
        const ChatSnapshot = await MyChatQuery.get();
        const chatDocs = ChatSnapshot.docs;
        for (const doc of chatDocs) {
            if (doc.data().owners.some(item => item.username === params.username)) {
                const latestMessageQuery = firestore.collection(`Chats/${doc.id}/messages`)
                    .orderBy('createdAt', 'desc')
                    .limit(1);

                const latestMessageSnapshot = await latestMessageQuery.get();
                const latestMessageDocs = latestMessageSnapshot.docs;

                if (!_.isEmpty(latestMessageDocs)) {
                    const latestMessageData = latestMessageDocs[0].data();
                    const latestMessage = latestMessageData.text;
                    const received = latestMessageData.received;
                    const image = !_.isEmpty(latestMessageData.image) ? latestMessageData.image[0] : "";

                    const chatData = {
                        data: doc.data(),
                        id: doc.id,
                        latestMessage,
                        image,
                        received
                    };

                    if (latestMessageData.user.name === params.username) chatData.latestMessage = "You: " + latestMessage;

                    results.push(chatData);
                } else {
                    results.push({
                        data: doc.data(),
                        id: doc.id,
                        latestMessage: "",
                        image: "",
                        received: true
                    });
                }
            }
        }
        setFilterData(results);
        setMasterData(results);
    } catch (error) {
        console.log(error)
    }
};

/*
    @route.params = {username: current username}
*/

export default function Chat({navigation, route}) {
    const [filteredData, setFilterData] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [search, setSearch] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [profilePic, setProfilePic] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            await getChats(route.params, setFilterData, setMasterData);
        };
        getProfilePicture(route.params.username).then((result)=>{
            setProfilePic(result)
        })
        fetchData();
    }, []);

    const handleSearchFilter = (text) => {
        searchFilter(text, masterData, setFilterData, setSearch)
    }

    const randomNumber = Math.floor(Math.random() * 100);


    return (
        <SafeAreaView style = {styles.container}>
            <SwipeListView
                data = {filteredData}
                ListFooterComponent = {
                    <View style = {{height:80}}/>
                }
                rightOpenValue = {-70}
                refreshControl = {
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            await onRefresh(setRefreshing, getChats, setFilterData, setMasterData, route.params);
                        }}
                    />
                }
                key = {randomNumber}
                contentContainerStyle = {{
                    padding: 20,
                }}
                ListHeaderComponent = {
                    <View style={{flex:1}}>
                        <View style={{marginTop:20, marginBottom:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>

                            <View >
                                <Text style={{fontSize:27, fontWeight:'bold'}}>Chats</Text>
                            </View>

                            <Image
                                resizeMode="cover"
                                source={{uri: profilePic}}
                                style={{height: 50, width: 50, borderRadius: 15, elevation: 2}}
                            />
                        </View>

                        <View style = {{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            height:50,
                            borderRadius:15,
                            marginBottom:10,
                            elevation:2
                        }}>
                            <Ionicons name = "search-outline" style = {{paddingLeft: 25}} size = {25} color = {'gray'}/>
                            <TextInput placeholder ='Search Chats...' value = {search} onChangeText = {(text) => handleSearchFilter(text)} placeholderTextColor = {'gray'} style = {{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:20, paddingHorizontal:5,}}/>
                        </View>
                        <Text style = {{marginBottom:20, fontSize:18, fontWeight: 'bold'}}>Conversations</Text>
                    </View>
                }
                renderHiddenItem = {({item}) => (
                    <View style={{ position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 75,
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                        <HiddenButton iconName={'trash-outline'} color={'red'} onPress={()=>{deleteChat(item, masterData, setMasterData)}}/>
                    </View>
                )}
                renderItem = {({item}) => (
                    <ChatItem item={item} params={route.params} navigation={navigation}/>
                )}
            />
            <StatusBar style = "auto"/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    separator: {
        height: 1,
        width: '100%',
        color:'black'
    }
});