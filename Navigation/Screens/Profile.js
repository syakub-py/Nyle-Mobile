import * as React from 'react';
import { View, Text, StyleSheet,Alert, ScrollView, Image, TouchableOpacity, Pressable, RefreshControl} from 'react-native';
import faker from 'faker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from './Components/PostCard.js';
import { SwipeListView } from 'react-native-swipe-list-view';
import {firestore} from './Components/Firebase'

const SectionTitle = ({title}) => {
  return(
    <View style = {{marginTop: 20, marginLeft:10}}>
      <Text style={{color: 'gray', fontSize:30, fontWeight:'bold'}}>{title}</Text>
    </View>)
    }

const Setting = ({title, nameOfIcon,type, onPress}) => {
  if (type == "button"){
    return(
      <TouchableOpacity style = {{flexDirection: 'row', height:50, alignItems:'center', width:'100%', marginLeft:20}} onPress = {onPress}>
        
      <View style={{flexDirection:'row'}}>
        <Ionicons name={nameOfIcon} style={{color:'black', marginRight: 20}} size={25}/>
        <Text style = {{flex:1, color:'black', fontSize: 16, fontWeight:'bold'}}>{title}</Text>
      </View>
        
      </TouchableOpacity>
    )
  }else{
    return(
      <View></View>
    )
  }
}

export default function Profile({navigation, route}) {
  const [userList, setUserList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getPosts = async () =>{
    const results = [];
    const MyPostsQuery = firestore.collection('AllPosts').where("PostedBy", "==", route.params.username)
    MyPostsQuery.get().then(postSnapshot =>{
      postSnapshot.forEach(doc => {
            results.push(doc.data())
        });
      })
    return results;
  }

  const onRefresh = () => {
    setRefreshing(true);
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      Alert.alert('Error Getting Posts: ', error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  React.useEffect(()=>{
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      Alert.alert('Error Getting Posts: ', error)
    })
  }, [])

  const deleteRow = (item) =>{
    firestore.collection("AllPosts").doc(item.title).delete()
    .then(() => {
        Alert.alert('Document successfully deleted!')
    })
    .catch((error) => {
        Alert.alert('Error deleting document: ', error)
    });
  }

    return (
      <View >
            <SwipeListView
              data={userList}
              rightOpenValue={-110}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent= {
                <View >
                  <View style = {{alignSelf:"flex-start", flexDirection:'row'}}>
                        <Image source = {{uri:`https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,}} style = {styles.image} resizeMode ="cover"/>
                        <Text style = {styles.username}>{route.params.username}</Text>
                  </View>
                                      
                    <SectionTitle
                    title = 'Account Settings'
                    />

                    <Setting
                      title = "Security"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = 'lock-closed-outline'
                    />

                    <Setting
                      title = "Appearance"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = 'eye-outline'
                    />

                    <Setting
                      title = "Connect a wallet"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = "wallet-outline"
                    />

                    <Setting
                      title = "2 factor Authentication"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon='settings-outline'

                    />
                            
                    <Setting
                      title = "Log Out"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = 'log-out-outline'
                    />
                  
                  <SectionTitle title={'Your Posts'}/>
                </View>
                }
              renderItem={({item}) => (
                <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location})}>
                  <PostCard data ={item}/>
                </Pressable>
                )}
                renderHiddenItem = {({item}) => (
                  <View style={{ position: 'absolute',
                  flexDirection:'row',
                  top: 0,
                  right: 10,
                  bottom: 0,
                  width: 100,
                  alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>deleteRow(item)} style={{marginRight:20}}>
                      <Ionicons size={30} name='trash-outline' color={"red"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("Edit Post", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, collectionPath:"Users/"+route.params.username+"/Posts"})}>
                      <Ionicons size={30} name='create-outline' color={"Black"}/>
                    </TouchableOpacity>
                  </View>
               )
              }
            /> 
      </View>
      
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    image:{
      width: 100,
      height: 100,
      borderRadius: 100,
      overflow: 'hidden',
      paddingBottom: 50,
      margin:30
    },
    username: {
      alignSelf:"center",
      fontSize:20,
      fontWeight:'bold'
    }
  });