import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    RefreshControl,
    Pressable,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {firestore, getstorage} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import _ from "lodash"

const onRefresh = (setRefreshing, getChats, setFilterData, setMasterData, route) => {
    setRefreshing(true);
    getChats(route).then((result) => {
        setFilterData(result);
        setMasterData(result);
    }).catch((error) => {
        console.log(error)
    })
    setTimeout(() => setRefreshing(false), 300);
};

const findUser = (userArray, route) => {
    for (let index = 0; index < userArray.length; index++) {
        if (userArray[index].username !== route.params.username) return index
    }
    return "";
}

const findProfilePic = (userArray, route) => {
    for (let index = 0; index < userArray.length; index++) {
        if (userArray[index].username === route.params.username) return index   
    }
    return "";
}

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
const deleteChat = (chat) => {
    firestore.collection('Chats').doc(chat.id).collection("messages").get().then((docs) => {
        docs.forEach((doc) => {
            if (!_.isEmpty(doc.data().image)) {
                doc.data().image.forEach((picture) => {
                    let imageRef = getstorage.refFromURL(picture)
                    imageRef.delete()
                })
            }
        })

        firestore.collection('Chats').doc(chat.id).delete().then(() => {
            onRefresh(setRefreshing, getChats, setFilterData, setMasterData, route);
        })
    })
}

const getChats = async (params) => {
    const results = [];
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
    return results;
};

/*
    @route.params = {username: current username}
*/

export default function Chat({navigation, route}) {
    const [filteredData, setFilterData] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [search, setSearch] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getChats(route.params).then((result) => {
            setFilterData(result);
            setMasterData(result);
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const handleSearchFilter = (text) => {
        searchFilter(text, masterData, setFilterData, setSearch)
    }

    const randomNumber = Math.floor(Math.random() * 100);

    const isUserNameLengthGreaterThanTen = (username) => {
        if (username.length > 10) return <Text style = {{fontSize:18, fontWeight:'500'}}>{username.slice(0, 13) + "..."}</Text>

        return <Text style = {{fontSize:18, fontWeight:'500'}}>{username}</Text>
    }

    const isItemLatestMessageLengthGreaterThanTen = (item) => {
        if (item.latestMessage.length > 10) return <Text style = {(item.received) ?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage.slice(0, 10) + " ..."}</Text>

        return <Text style = {(item.received) ?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage}</Text>
    }

    const isItemImage = (item) => {
        if (item.image) {
            return (
                <View style = {{justifyContent:'center'}}>
                    <Image source = {{uri: item.image}} style = {{height:50, width:50, borderRadius:4, position:'absolute', left:30, elevation:2}}/>
                </View>
            )
        }
        return <View/>
    }

    return (
        <SafeAreaView style = {styles.container}>
            <SwipeListView
                data = {filteredData}
                ListFooterComponent = {
                    <View style = {{height:80}}>

                    </View>
                }
                rightOpenValue = {-50}
                refreshControl = {
                    <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh(setRefreshing, getChats, setFilterData, setMasterData, route)} />
                }
                key = {randomNumber}
                contentContainerStyle = {{
                    padding: 20,
                }}
                ListHeaderComponent = {
                    <View>

                        <View style = {{flexDirection:'row'}}>
                            <Image source = {require('../Screens/Components/icon.png')} style = {{height:75, width:75}}/>
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
                renderHiddenItem = {({i, item}) => (
                    <View style = {{ position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 75,
                        justifyContent: 'center',
                        alignItems: 'center'}} key = {i}>
                        <TouchableOpacity onPress = {() => {deleteChat(item)}}>
                            <Ionicons size = {25} name ='trash-outline' color = {"red"}/>
                        </TouchableOpacity>
                    </View>
                )}
                renderItem = {({item, index}) => {
                    const username = item.data.owners[findUser(item.data.owners, route)].username
                    return (
                        <Pressable onPress = {() => {navigation.navigate("chat box", {username: route.params.username, conversationID:item.id, name: username, avatar:item.data.owners[findUser(item.data.owners, route)].profilePic, otherAvatar:item.data.owners[findProfilePic(item.data.owners, route)].profilePic, userId:findUser(item.data.owners, route)})}} key = {index}>
                            <View style = {{flexDirection: 'row', marginBottom:15, backgroundColor:"white", alignItems:'center'}} >
                                <View>
                                    <Image
                                        source = {{uri: item.data.owners[findUser(item.data.owners, route)].profilePic}}
                                        style = {{width: 60, height:60, borderRadius:15,marginRight:15,}}
                                    />
                                </View>

                                <View style = {{flexDirection:'column'}}>
                                    {isUserNameLengthGreaterThanTen(username)}
                                    {isItemLatestMessageLengthGreaterThanTen(item)}
                                </View>
                                {isItemImage(item)}
                            </View>
                        </Pressable>
                    )
                }}
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
