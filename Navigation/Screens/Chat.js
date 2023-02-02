import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView,Image, RefreshControl, Pressable, TextInput, TouchableOpacity } from 'react-native';
import faker from 'faker';
import {firestore} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function Chat({navigation, route}) {
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const[search, setSearch] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false);

  const getChats = async () =>{
    const results = [];
    //.where("owners.username", "==", route.params.username)
    const MyChatQuery = firestore.collection('Chats')
    await MyChatQuery.get().then(ChatSnapshot =>{
      ChatSnapshot.forEach(doc => {
          results.push({data: doc.data(), id:doc.id})
        });
      })
      return results;

  }

  const addChat = (collectionPath, receiver) =>{
    if (!collectionPath) {
        throw new Error('Error: collection name cannot be empty');
    }
    return firestore.collection(collectionPath).doc(receiver).set({
      key: faker.random.number({min:1, max:100}),
      image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
      name: receiver,
      email: receiver,
      lastText:faker.lorem.lines(1)
    })
    .then(ref => {
      console.log('Added document with ID: ' + receiver);
    })
    .catch(error => {
      console.log('Error adding document: ', error);
    });
  }

  const onRefresh = () => {
    setRefreshing(true);
    getChats().then((result) =>{
      setfilterData(result);
      setMasterData(result);
    }).catch((error)=>{
      console.log(error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };

  React.useEffect(()=>{
    getChats().then((result) =>{
      setfilterData(result);
      setMasterData(result);
    }).catch((error)=>{
      console.log(error)
    })
  }, [])

  const FloatingButton = () => {
    return (
      <View style={{ position: 'absolute', bottom: '10%', right: 1 }}>
        {/* addChat( "Users/"+route.params.username+"/Conversations", faker.internet.email()) */}
        <Pressable onPress={()=>navigation.navigate("Add chat", {username:route.params.username})}>
          <View style={{ 
              height: 70,
              width: 70,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Ionicons name="add-outline"  size={40}/>
          </View>
        </Pressable>
      </View>
    );
  };

  const searchFilter = (text) =>{
    if (text){
      const newData = masterData.filter((item) =>{
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
        const textData = text.toUpperCase();
        return itemData.indexOf(textData)>-1;
      });
      setfilterData(newData);
      setSearch(text);
    }else{
      setfilterData(masterData);
      setSearch(text);
    }
  }

  const findUser = (userArray)=>{
    for (let index = 0; index < userArray.length; index++) {
      if (userArray[index].username!=route.params.username){
        return index
      }
    }
    return "";
  }

  const deleteRow = (item) =>{
    firestore.collection("Chats").where("recipient","==",item.recipient).delete()
    .then(() => {
        console.log('Document successfully deleted!');
    })
    .catch((error) => {
        console.error('Error deleting document: ', error);
    });
  }
    return (
      <SafeAreaView style={styles.container}>
          <SwipeListView
          data = {filteredData}
          keyExtractor = {item => item.key}
          rightOpenValue={-50}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle = {{
            padding: 20,
          }}
          ListHeaderComponent = {
            <View>
                
              <View style={{flexDirection:'row'}}>
                <FloatingButton/>
                <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100}}/>
              </View>

              <View >
                <TextInput placeholder='Search Chats...' value={search} onChangeText={(text) => searchFilter(text)} style={{marginTop:5, marginBottom:10,elevation:2, height:60, paddingHorizontal:15, borderRadius:50, backgroundColor:'white'}}/>
                <Text style= {{marginBottom:20, fontSize:18, fontWeight: 'bold'}}>All messages</Text>
              </View>
            
            </View>
        }
          renderHiddenItem = {({item, index}) => (
            <View style={{ position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center'}} key={index}>
              <TouchableOpacity onPress={()=>deleteRow(item)}>
                <Ionicons size={25} name='trash-outline' color={"red"}/>
              </TouchableOpacity>
            </View>
         )}
          renderItem = {({item, index}) => {
            const username = item.data.owners[findUser(item.data.owners)].username
            return(

              <Pressable onPress={() => {navigation.navigate("chat box", {username: route.params.username, conversationID:item.id, name: username, avatar:item.data.owners[findUser(item.data.owners)].profilePic, userId:findUser(item.data.owners)})}} key={index}>
                <View style = {{flexDirection: 'row', marginBottom:15, backgroundColor:"white", alignItems:'center'}}>
                  <Image
                  source = {{uri: item.data.owners[findUser(item.data.owners)].profilePic}}
                  style = {{width: 60, height:60, borderRadius:50,marginRight:15,}}/>
                  <View>
                    <Text style ={{fontSize:18, fontWeight:'bold'}}>{username}</Text>
                  </View>
                </View>
              </Pressable>
            )
          }}
          />
        <StatusBar style="auto"/>
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