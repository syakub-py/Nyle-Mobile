import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SwipeListView} from 'react-native-swipe-list-view';
import HiddenButton from '../Components/HiddenButton';
import ChatItem from '../Components/ChatComponents/ChatItem';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../Contexts/UserContext';

const searchFilter = (text, masterData, setSearch) => {
  if (text) {
    setSearch(text);
    return masterData.filter((item) => {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData)>-1;
    });
  } else {
    setSearch(text);
  }
};

export default function Chat() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  const handleSearchFilter = (text) => {
    searchFilter(text, userContext.chats, setSearch);
  };

  const randomNumber = Math.floor(Math.random() * 100);
  useEffect(()=>{
    setRefreshing(true);
    userContext.getChats().then(()=>{
      setRefreshing(false);
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    userContext.getChats().then(()=>{
      Vibration.vibrate(10);
      setRefreshing(false);
    });
  };

  return (
    <SafeAreaView style = {styles.container}>
      <SwipeListView
        data = {userContext.chats}
        ListFooterComponent = {
          <View style = {{height: 80}}/>
        }
        rightOpenValue = {-70}
        refreshControl = {
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        key = {randomNumber}
        contentContainerStyle = {{
          padding: 20,
        }}
        ListHeaderComponent = {
          <View style={{flex: 1}}>
            <View style={{marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

              <View >
                <Text style={{fontSize: 27, fontWeight: 'bold'}}>Chats</Text>
              </View>

              <Image
                resizeMode="cover"
                source={{uri: userContext.profilePicture}}
                style={{height: 50, width: 50, borderRadius: 15}}
              />
            </View>

            <View style = {{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              height: 50,
              borderRadius: 15,
              marginBottom: 10,
              elevation: 2,
            }}>
              <Ionicons name = "search-outline" style = {{paddingLeft: 25}} size = {25} color = {'gray'}/>
              <TextInput placeholder ='Search Chats...' value = {search} onChangeText = {(text) => handleSearchFilter(text)} placeholderTextColor = {'gray'} style = {{flex: 1, fontWeight: '400', backgroundColor: 'white', margin: 10, borderRadius: 20, paddingHorizontal: 5}}/>
            </View>
            <Text style = {{marginBottom: 20, fontSize: 18, fontWeight: 'bold'}}>Conversations</Text>
          </View>
        }
        renderHiddenItem = {({item}) => (
          <View style={{position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center'}}>
            <HiddenButton iconName={'trash-outline'} color={'red'} onPress={()=>userContext.deleteChat(item)}/>
          </View>
        )}
        renderItem = {({item}) => (
          <ChatItem Chat={item}/>
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
    color: 'black',
  },
});
