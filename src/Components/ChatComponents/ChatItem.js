import {Image, Pressable, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../../Contexts/UserContext';

const UserNameLengthGreaterThanTen = ({username}) => {
  if (username.length > 10) return <Text style = {{fontSize: 18, fontWeight: '500'}}>{username.slice(0, 13) + '...'}</Text>;

  return <Text style = {{fontSize: 18, fontWeight: '500'}}>{username}</Text>;
};

const ItemLatestMessageLengthGreaterThanTen = ({item}) => {
  if (item.latestMessage.length > 10) return <Text style = {(item.latestMessageReceived) ?{color: 'gray', fontSize: 14, paddingTop: 3}:{color: 'black', fontSize: 14, paddingTop: 3, fontWeight: 'bold'}}>{item.latestMessage}</Text>;

  return <Text style = {(item.latestMessageReceived)?{color: 'gray', fontSize: 14, paddingTop: 3}:{color: 'black', fontSize: 14, paddingTop: 3, fontWeight: 'bold'}}>{item.latestMessage}</Text>;
};

const ItemImage = ({item}) => {
  if (!item.latestImageUri) {
    return null;
  }
  return (
    <View style = {{justifyContent: 'center'}}>
      <Image source = {{uri: item.latestImageUri}} style = {{height: 50, width: 50, borderRadius: 4, position: 'absolute', left: 30, elevation: 2}}/>
    </View>
  );
};

export default function ChatItem({Chat}) {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  const username = userContext.username;
  const OtherUsername = Chat.owners.find((UserItem)=> UserItem.username !== username).username;
  const OtherProfilePic = Chat.owners.find((UserItem)=> UserItem.username !== username).profilePic;

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('chat box', {
          conversationID: Chat.id,
          name: OtherUsername,
          otherAvatar: OtherProfilePic,
          userId: Chat.owners.indexOf(username),
        });
      }}
      key={Chat}>
      <View style={{flexDirection: 'row', marginBottom: 15, backgroundColor: 'white', alignItems: 'center'}}>
        <View>
          <Image
            source={{uri: Chat.owners.find((user)=> user.username !== username).profilePic}}
            style={{width: 60, height: 60, borderRadius: 15, marginRight: 15}}
          />
        </View>
        <View style={{flexDirection: 'column'}}>
          <UserNameLengthGreaterThanTen username={OtherUsername} />
          <ItemLatestMessageLengthGreaterThanTen item={Chat} />
        </View>
        <ItemImage item={Chat} />
      </View>
    </Pressable>
  );
}
