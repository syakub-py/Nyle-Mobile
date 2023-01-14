import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView, FlatList, SwipeListView ,Image, RefreshControl, Pressable, TextInput } from 'react-native';
import faker from 'faker';
import {firestore, firestoreLite} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {collection, getDocs} from 'firebase/firestore/lite'


export default function Chat({navigation, route}) {
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const[search, setSearch] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false);

  
  const getChats = async ()=>{
    const results =[];
    const chatCollection = collection(firestoreLite, "Users/"+route.params.username+"/Conversations");
    const chatSnapshot = await getDocs(chatCollection);
    chatSnapshot.forEach(doc => {
      results.push(doc.data())
    });
    return results;
  }

  const addChat = (collectionPath, receiver) =>{
    faker.seed(10);
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
      console.log('Added document with ID: ' + ref.id);
    })
    .catch(error => {
      console.log('Error adding document: ', error);
    });
  }


  const onRefresh = () => {
    setRefreshing(true);
    getChats().then((result) =>{
      const chats = result
      setfilterData(chats);
      setMasterData(chats);
    }).catch((error)=>{
      console.log(error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };

  React.useEffect(()=>{
    getChats().then((result) =>{
      const chats = result
      setfilterData(chats);
      setMasterData(chats);
    }).catch((error)=>{
      console.log(error)
    })
  }, [])

  const FloatingButton = () => {
    return (
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Pressable onPress={()=>addChat( "Users/"+route.params.username+"/Conversations", faker.internet.email())}>
          <View style={{ 
              backgroundColor: 'black',
              height: 70,
              width: 70,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Ionicons name="add-circle" color={'white'} size={40}/>
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
  const ItemSeparator = () => {
    return(
      <View style ={{height:1, backgroundColor:'lightgray', width:'100%', marginBottom:5}}/>
    )
  }
    return (
      <SafeAreaView style={styles.container}>

          <FlatList
          data = {filteredData}
          keyExtractor = {item => item.key}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle = {{
            padding: 20,
          }}
          ListHeaderComponent = {
            <View>
              <View style={{paddingTop:20}}>
                <TextInput placeholder='Search Chats...' value={search} onChangeText={(text) => searchFilter(text)} style={{marginTop:10, marginBottom:10,elevation:2, height:60, paddingHorizontal:15, borderRadius:50, backgroundColor:'white'}}/>
                <Text style= {{marginBottom:20, fontSize:18, fontWeight: 'bold'}}>Current Conversions</Text>
              </View>
            </View>
        }
          ItemSeparatorComponent = {ItemSeparator}
          renderItem = {({item, index}) => {
            return(
              <Pressable onPress={() => {navigation.navigate("chat box", {collectionPath: "Users/"+route.params.username+"/Conversations"})}}>
                <View style = {{flexDirection: 'row', marginBottom:15}}>
                  <Image
                  source = {{uri: item.image}}
                  style = {{
                    width: 50, height:50, borderRadius:50,
                    marginRight: 10,
                  }}
                  />
                  <View>
                    <Text style ={{fontSize:18, fontWeight:'bold'}}>{item.name}</Text>
                    <Text style ={{fontSize:15, color:'grey'}}>{item.email}</Text>
                    <Text style = {{fontSize:14, color:'lightgrey'}}>{item.lastText}</Text>
                  </View>
                </View>
              </Pressable>
            )
          }}
          />
        <StatusBar style="auto"/>
        <FloatingButton/>
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