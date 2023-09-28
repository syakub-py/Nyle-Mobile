import {Image, Pressable, Text, View} from "react-native";
import React from "react";
import {generateChatID} from "../PostDetailsComponents/renderIsPostedBySameAsUsername";
const UserNameLengthGreaterThanTen = ({username}) => {
    if (username.length > 10) return <Text style = {{fontSize:18, fontWeight:'500'}}>{username.slice(0, 13) + "..."}</Text>

    return <Text style = {{fontSize:18, fontWeight:'500'}}>{username}</Text>
}

const ItemLatestMessageLengthGreaterThanTen = ({item}) => {
    if (item.latestMessage.length > 10) return <Text style = {(item.received) ?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage}</Text>

    return <Text style = {(item.received) ?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage}</Text>
}

const ItemImage = ({item}) => {
    if (item.image) {
        return (
            <View style = {{justifyContent:'center'}}>
                <Image source = {{uri: item.image}} style = {{height:50, width:50, borderRadius:4, position:'absolute', left:30, elevation:2}}/>
            </View>
        )
    }
    return <View/>
}


export default function ChatItem({ item, params, navigation }) {
    const userId = generateChatID(item.data.owners[0], item.data.owners[1]);

    const MyUsername = params.username;
    const MyProfilePicture = item.data.owners.find((UserItem)=> UserItem.username  === MyUsername).profilePic
    const OtherUsername = item.data.owners.find((UserItem)=> UserItem.username !== MyUsername).username
    const OtherProfilePic =  item.data.owners.find((UserItem)=> UserItem.username  !== MyUsername).profilePic

    return (
        <Pressable
            onPress={() => {
                navigation.navigate("chat box", {
                    username: params.username,
                    conversationID: item.id,
                    name: OtherUsername,
                    avatar: MyProfilePicture,
                    otherAvatar:OtherProfilePic,
                    userId: userId
                });
            }}
            key={item}
        >
            <View style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: "white", alignItems: 'center' }}>
                <View>
                    <Image
                        source={{ uri:item.data.owners.find((user)=> user.username !== params.username).profilePic }}
                        style={{ width: 60, height: 60, borderRadius: 15, marginRight: 15 }}
                    />
                </View>

                <View style={{ flexDirection: 'column' }}>
                    <UserNameLengthGreaterThanTen username={OtherUsername} />
                    <ItemLatestMessageLengthGreaterThanTen item={item} />
                </View>
                <ItemImage item={item} />
            </View>
        </Pressable>
    );

}