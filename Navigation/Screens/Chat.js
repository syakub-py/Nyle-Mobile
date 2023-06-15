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


/*
    @route.params = {username: current username}
 */

export default function Chat({navigation, route}) {
    const [filteredData, setFilterData] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [search, setSearch] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const getChats = async () => {
        const results = [];
        const MyChatQuery = firestore.collection('Chats');
        const ChatSnapshot = await MyChatQuery.get();
        const chatDocs = ChatSnapshot.docs;

        for (const doc of chatDocs) {
            if (doc.data().owners.some(item => item.username === route.params.username)) {
                const latestMessageQuery = firestore.collection(`Chats/${doc.id}/messages`)
                    .orderBy('createdAt', 'desc')
                    .limit(1);

                const latestMessageSnapshot = await latestMessageQuery.get();
                const latestMessageDocs = latestMessageSnapshot.docs;

                if (latestMessageDocs.length > 0) {
                    const latestMessageData = latestMessageDocs[0].data();
                    const latestMessage = latestMessageData.text;
                    const received = latestMessageData.received;
                    const image = latestMessageData.image.length > 0 ? latestMessageData.image[0] : "";

                    const chatData = {
                        data: doc.data(),
                        id: doc.id,
                        latestMessage,
                        image,
                        received
                    };

                    if (latestMessageData.user.name === route.params.username) {
                        chatData.latestMessage = "You: " + latestMessage;
                    }
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



    const onRefresh = () => {
        setRefreshing(true);
        getChats().then((result) => {
            setFilterData(result);
            setMasterData(result);
        }).catch((error) => {
            console.log(error)
        })
        setTimeout(() => setRefreshing(false), 300);
    };

    useEffect(() => {
        getChats().then((result) => {
            setFilterData(result);
            setMasterData(result);
        }).catch((error) => {
            console.log(error)
        })
    }, [])


    const searchFilter = (text) => {
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

    const findUser = (userArray) => {
        for (let index = 0; index < userArray.length; index++) {
            if (userArray[index].username!==route.params.username) {
                return index
            }
        }
        return "";
    }

    const findProfilePic = (userArray) => {
        for (let index = 0; index < userArray.length; index++) {
            if (userArray[index].username ===route.params.username) {
                return index
            }
        }
        return "";
    }

    // Delete a folder and all its contents
    const deleteChat= (chat) => {
        firestore.collection('Chats').doc(chat.id).collection("messages").get().then((docs) => {
            docs.forEach((doc) => {
                if (doc.data().image.length > 0) {
                    doc.data().image.forEach((picture) => {
                        let imageRef = getstorage.refFromURL(picture)
                        imageRef.delete().then(() => {
                            console.log("deleted: " + imageRef.name)
                        })
                    })
                }
            })

            firestore.collection('Chats').doc(chat.id).delete().then(() => {
                console.log('Chat document successfully deleted!');
                onRefresh();
            })
        })
    }


    let randomNumber = Math.floor(Math.random() * 100);
    return (
        <SafeAreaView style = {styles.container}>
            <SwipeListView
                data = {filteredData}
                ListFooterComponent= {
                    <View style = {{height:80}}>

                    </View>
                }
                rightOpenValue = {-50}
                refreshControl= {
                    <RefreshControl refreshing= {refreshing} onRefresh= {onRefresh} />
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
                            <Ionicons name ="search-outline" style = {{paddingLeft: 25}} size = {25} color = {'gray'}/>
                            <TextInput placeholder='Search Chats...' value = {search} onChangeText= {(text) => searchFilter(text)} placeholderTextColor= {'gray'} style = {{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:20, paddingHorizontal:5,}}/>
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
                        alignItems: 'center'}} key= {i}>
                        <TouchableOpacity onPress= {() => {deleteChat(item)}}>
                            <Ionicons size = {25} name ='trash-outline' color= {"red"}/>
                        </TouchableOpacity>
                    </View>
                )}
                renderItem = {({item, index}) => {
                    const username = item.data.owners[findUser(item.data.owners)].username
                    return (
                        <Pressable onPress= {() => {navigation.navigate("chat box", {username: route.params.username, conversationID:item.id, name: username, avatar:item.data.owners[findUser(item.data.owners)].profilePic, otherAvatar:item.data.owners[findProfilePic(item.data.owners)].profilePic, userId:findUser(item.data.owners)})}} key= {index}>
                            <View style = {{flexDirection: 'row', marginBottom:15, backgroundColor:"white", alignItems:'center'}} >
                                <View>
                                    <Image
                                        source = {{uri: item.data.owners[findUser(item.data.owners)].profilePic}}
                                        style = {{width: 60, height:60, borderRadius:15,marginRight:15,}}
                                    />
                                </View>

                                <View style = {{flexDirection:'column'}}>
                                    {
                                        (username.length > 10)?(
                                            <Text style = {{fontSize:18, fontWeight:'500'}}>{username.slice(0, 13) + "..."}</Text>
                                        ):(
                                            <Text style = {{fontSize:18, fontWeight:'500'}}>{username}</Text>
                                        )
                                    }

                                    {
                                        (item.latestMessage.length > 10)?(
                                            <Text style = {(item.received)?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage.slice(0, 10) + " ..."}</Text>
                                        ):(
                                            <Text style = {(item.received)?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage}</Text>
                                        )
                                    }
                                </View>
                                {
                                    (item.image)?(
                                        <View style = {{justifyContent:'center'}}>
                                            <Image source = {{uri: item.image}} style = {{height:50, width:50, borderRadius:4, position:'absolute', left:30, elevation:2}}/>
                                        </View>
                                    ):(
                                        <View/>
                                    )
                                }
                            </View>
                        </Pressable>
                    )
                }}
            />
            <StatusBar style ="auto"/>
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