import {Alert, Image, Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import {firestore} from "../Firebase";


const handleAddChat = (params, navigation) => {
    if (params.username !== params.item.PostedBy) {
        firestore
            .collection('Chats')
            .add({
                owners: [
                    {
                        profilePic: params.CurrentUserProfilePic,
                        username: params.username,
                    },
                    {
                        profilePic: params.item.profilePic,
                        username: params.item.PostedBy,
                    },
                ],
            })
            .then((ref) => {
                const owners =   [
                    {
                        profilePic: params.CurrentUserProfilePic,
                        username: params.username,
                    },
                    {
                        profilePic: params.item.profilePic,
                        username: params.item.PostedBy,
                    },
                ]

                const username = owners[1].username
                navigation.navigate("chat box", {username: params.username, conversationID:ref.id, name: username, avatar: owners[1].profilePic, otherAvatar:owners[0].profilePic, userId:findUser(owners, params.username)})
            })
            .catch((error) => {
                Alert.alert('Error adding document: ', error);
            });
    }
};

export default function isPostedBySameAsUsername(params, username, rating, numOfReviews) {
    if (params.item.PostedBy !== username) {
        return (
            <View style = {{flexDirection:"row", justifyContent:'space-between'}}>
                <View style = {{justifyContent:'center', flexDirection:'row',  marginLeft:10}}>
                    <Image source = {{uri:params.item.profilePic}} style = {{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                    <View style = {{margin:10,alignSelf:'center'}}>
                        <Text style = {{fontWeight:'bold', color:'black', }}>{params.item.PostedBy}</Text>
                        <Text style = {{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                        <Pressable onPress = {() => {navigation.navigate("Reviews", {username: params.item.PostedBy , currentUser: username})}}>
                            <View style = {{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                                marginTop: 2
                            }}>
                                <Ionicons name = "star" style = {{ marginRight: 3 }} color = "#ebd61e" size = {13} />
                                <Text style = {{ fontSize: 12, fontWeight: 'bold' }}>{rating.toFixed(1)}</Text>
                                <Text style = {{ fontSize: 10, color:'grey', marginLeft:3}}>({numOfReviews} reviews)</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                <Pressable onPress = {()=>handleAddChat(params, navigation)}>
                    <View style = {{height:60, width:60, borderRadius:15, backgroundColor:'#292929', elevation:10, margin:10}}>
                        <Ionicons name = "chatbox-ellipses-outline" color = {'white'} size = {30} style = {{margin:15}}/>
                    </View>
                </Pressable>
            </View>
        )
    }

    return (
        <View style = {{flexDirection:"row", justifyContent:'space-between'}}>
            <View style = {{justifyContent:'center', flexDirection:'row', margin:10}}>
                <Image source = {{uri:params.item.profilePic}} style = {{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                <View style = {{margin:10,alignSelf:'center'}}>
                    <Text style = {{fontWeight:'bold', color:'black', }}>{params.item.PostedBy} (You)</Text>
                    <Text style = {{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                    <View style = {{flexDirection:'row', alignItems:'center', marginTop:3}}>
                        <Ionicons name = {'star'} style = {{marginRight:3}} color = {"#ebd61e"} size = {13}/>
                        <Text style = {{fontSize:12, fontWeight:'bold'}}>{rating.toFixed(1)}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}