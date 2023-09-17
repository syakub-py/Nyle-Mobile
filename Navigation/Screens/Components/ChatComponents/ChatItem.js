import {Image, Pressable, Text, View} from "react-native";
import React from "react";


const isUserNameLengthGreaterThanTen = (username) => {
    if (username.length > 10) return <Text style = {{fontSize:18, fontWeight:'500'}}>{username.slice(0, 13) + "..."}</Text>

    return <Text style = {{fontSize:18, fontWeight:'500'}}>{username}</Text>
}

const isItemLatestMessageLengthGreaterThanTen = (item) => {
    if (item.latestMessage.length > 10) return <Text style = {(item.received) ?{color:'gray', fontSize:14, paddingTop:3}:{color:'black', fontSize:14, paddingTop:3, fontWeight:"bold"}}>{item.latestMessage}</Text>

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

const findProfilePic = (userArray, params) => {
    for (let index = 0; index < userArray.length; index++) {
        if (userArray[index].username === params.username) return index
    }
    return "";
}
const findUser = (userArray, params) => {
    for (let index = 0; index < userArray.length; index++) {
        if (userArray[index].username !== params.username) return index
    }
    return "";
}
export default function ChatItem({item, params, navigation}){
    const username = item.data.owners[findUser(item.data.owners, params)].username
    return (
        <Pressable onPress = {() => {navigation.navigate("chat box", {username: params.username, conversationID:item.id, name: username, avatar:item.data.owners[findUser(item.data.owners, params)].profilePic, otherAvatar:item.data.owners[findProfilePic(item.data.owners, params)].profilePic, userId:findUser(item.data.owners, params)})}} key = {item}>
            <View style = {{flexDirection: 'row', marginBottom:15, backgroundColor:"white", alignItems:'center'}} >
                <View>
                    <Image
                        source = {{uri: item.data.owners[findUser(item.data.owners, params)].profilePic}}
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
}