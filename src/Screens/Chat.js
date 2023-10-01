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
import {firestore, getstorage} from '../Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import _ from "lodash"
import {getProfilePicture, getUsername} from "./GlobalFunctions";
import HiddenButton from "../Components/HiddenButton";
import ChatItem from "../Components/ChatComponents/ChatItem";
import {useNavigation} from "@react-navigation/native";
import {LoadingAnimation} from "../Components/LoadingAnimation";

const onRefresh = async (setRefreshing, getChats, setFilterData, setMasterData, username) => {
    setRefreshing(true);
    await getChats(username, setFilterData, setMasterData)
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

const deleteChat = async (chat, filteredData, setFilteredData) => {
    const docSnapshots = await firestore.collection('Chats').doc(chat.id).collection("messages").get();
    for (let doc of docSnapshots.docs) {
        if (!_.isEmpty(doc.data().image)) {
            for (let picture of doc.data().image) {
                let imageRef = getstorage.refFromURL(picture)
                await imageRef.delete()
            }
        }
    }
    setFilteredData(filteredData.filter((item) =>(chat.id!==item.id)))
    await firestore.collection('Chats').doc(chat.id).delete();
}

const getChats = async (username, setFilterData, setMasterData) => {
    let results = [];
    try {
        const MyChatQuery = firestore.collection('Chats');
        const ChatSnapshot = await MyChatQuery.get();
        const chatDocs = ChatSnapshot.docs;
        for (const doc of chatDocs) {
            if (doc.data().owners.some(item => item.username === username)) {
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

                    if (latestMessageData.user.name === username) chatData.latestMessage = "You: " + latestMessage;

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

export default function Chat() {
    const [filteredData, setFilterData] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [search, setSearch] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [profilePic, setProfilePic] = useState(null)
    const navigation = useNavigation()
    const [username, setUsername] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const profileName = await getUsername();
                setUsername(profileName);

                const pic = await getProfilePicture(profileName);
                setProfilePic(pic);
                return await getChats(profileName, setFilterData, setMasterData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);


    LoadingAnimation(loading);

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
                            await onRefresh(setRefreshing, getChats, setFilterData, setMasterData,username);
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
                        <HiddenButton iconName={'trash-outline'} color={'red'} onPress={()=>{deleteChat(item, filteredData, setFilterData)}}/>
                    </View>
                )}
                renderItem = {({item}) => (
                    <ChatItem item={item} username={username} navigation={navigation}/>
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
