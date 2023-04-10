import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView,Image, RefreshControl, Pressable, TextInput, TouchableOpacity } from 'react-native';
import {firestore, getstorage} from './Components/Firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function Chat({navigation, route}) {
  const [filteredData, setFilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [search, setSearch] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false);

  const getChats = async () =>{
    const results = [];
    const MyChatQuery = firestore.collection('Chats')
    await MyChatQuery.get().then(ChatSnapshot =>{
      ChatSnapshot.forEach(doc => {
          for(let i = 0; i<doc.data().owners.length; i++){
            if (doc.data().owners[i].username === route.params.username){
              results.push({data: doc.data(), id:doc.id})
            }
            
          }
        });
      })
      return results;
    }


  const onRefresh = () => {
    setRefreshing(true);
    getChats().then((result) =>{
      setFilterData(result);
      setMasterData(result);
    }).catch((error)=>{
      console.log(error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };

  React.useEffect(()=>{
    getChats().then((result) =>{
      setFilterData(result);
      setMasterData(result);
    }).catch((error)=>{
      console.log(error)
    })
  }, [])


  const searchFilter = (text) =>{
    if (text){
      const newData = masterData.filter((item) =>{
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
        const textData = text.toUpperCase();
        return itemData.indexOf(textData)>-1;
      });
      setFilterData(newData);
      setSearch(text);
    }else{
      setFilterData(masterData);
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

  const findProfilePic = (userArray)=>{
    for (let index = 0; index < userArray.length; index++) {
      if (userArray[index].username===route.params.username){
        return index
      }
    }
    return "";
  }

// Delete a folder and all its contents
function deleteFolder(ref) {
    ref.listAll().then(function(dir) {
        dir.items.forEach(function(fileRef) {
            // Delete file
            fileRef.delete().then(function() {
                // File deleted successfully
                console.log("file deleted")
            }).catch(function(error) {
                // Error deleting file
                console.log(error)

            });
        });
        dir.prefixes.forEach(function(folderRef) {
            // Recursively delete subfolder
            deleteFolder(folderRef);
        });
        // Delete the parent folder once all files and subfolders have been deleted
        ref.delete().then(function() {
            // Folder deleted successfully
            console.log("folder deleted")
        }).catch(function(error) {
            // Error deleting folder
            console.log(error)
        });
    }).catch(function(error) {
        // Error listing items in folder
        console.log(error)
    });
}


const deleteRow = (id) =>{
    firestore.collection('Chats').doc(id).delete()
    .then(() => {
      console.log('Document successfully deleted!');
      const picRef = getstorage.ref(`MessageImages/${id}`);
      picRef
          .delete()
          .then(() => {
            deleteFolder(picRef);
            console.log(`Deleted folder with id: ${id}`);
          })
          .catch((error) => {
            console.log("Error deleting picture:", error);
          });
    })
    .catch((error) => {
      console.error('Error deleting document: ', error);
    });
    onRefresh();
  }
  let randomNumber = Math.floor(Math.random() * 100);

    return (
      <SafeAreaView style={styles.container}>
          <SwipeListView
          data = {filteredData}
          rightOpenValue={-50}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          key = {randomNumber}
          contentContainerStyle = {{
            padding: 20,
          }}
          ListHeaderComponent = {
            <View>
                
              <View style={{flexDirection:'row'}}>
                <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100}}/>
              </View>


                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    height:60,
                    borderRadius:50,
                    marginBottom:10,
                    elevation:2
                }}>
                    <Ionicons name="search-outline" style={{paddingLeft: 25}} size={25} color ={'gray'}/>
                    <TextInput placeholder='Search Chats...' value={search} onChangeText={(text) => searchFilter(text)} placeholderTextColor={'gray'} style={{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:20, paddingHorizontal:5,}}/>
                </View>
                <Text style= {{marginBottom:20, fontSize:18, fontWeight: 'bold'}}>All Conversations</Text>
            </View>
        }
          renderHiddenItem = {({i, item}) => (
            <View style={{ position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center'}} key={i}>
              <TouchableOpacity onPress={()=>{deleteRow(item.id)}}>
                <Ionicons size={25} name='trash-outline' color={"red"}/>
              </TouchableOpacity>
            </View>
         )}
          renderItem = {({item, index}) => {
            const username = item.data.owners[findUser(item.data.owners)].username
            return(
              <Pressable onPress={() => {navigation.navigate("chat box", {username: route.params.username, conversationID:item.id, name: username, avatar:item.data.owners[findUser(item.data.owners)].profilePic, otherAvatar:item.data.owners[findProfilePic(item.data.owners)].profilePic, userId:findUser(item.data.owners)})}} key={index}>
                <View style = {{flexDirection: 'row', marginBottom:15, backgroundColor:"white", alignItems:'center'}} >
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