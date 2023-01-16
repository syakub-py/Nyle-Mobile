import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView, ScrollView, Image, TouchableOpacity, Pressable, RefreshControl} from 'react-native';
import faker from 'faker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from './Components/PostCard.js';
import {collection, getDocs} from 'firebase/firestore/lite'
import {firestoreLite} from './Components/Firebase'
import { SwipeListView } from 'react-native-swipe-list-view';
import {firestore} from './Components/Firebase'

const SectionTitle = ({title}) => {
  return(
    <View style = {{marginTop: 20}}>
      <Text style={{color: 'gray', fontSize:20, fontWeight:'500'}}>{title}</Text>
    </View>)}

const Setting = ({title, type, onPress}) => {
  if (type == "button"){
    return(
      <TouchableOpacity style = {{flexDirection: 'row', height:50, alignItems:'center'}} onPress = {onPress}>
        <Text style = {{flex:1, color:'black', fontSize: 16, fontWeight:'bold'}}>{title}</Text>
        <View style = {{flexDirection:'row', alignItems:'center'}}>
          <Ionicons name='chevron-forward-outline' style={{color:'lightgray'}} size={19}/>
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


  const getPosts = async ()=>{
    const results =[];
    const postCollection = collection(firestoreLite, "Users/"+route.params.username+"/Posts");
    const postSnapshot = await getDocs(postCollection);
    postSnapshot.forEach(doc => {
      results.push(doc.data())
    });
    return results;
  }

  const onRefresh = () => {
    setRefreshing(true);
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      console.log(error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  React.useEffect(()=>{
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      console.log(error)
    })
  }, [])

  const deleteRow = (item) =>{
    firestore.collection("Users/"+route.params.username+"/Posts").doc(item.title).delete()
    .then(() => {
        console.log('Document successfully deleted!');
    })
    .catch((error) => {
        console.error('Error deleting document: ', error);
    });
  }
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator = {false} style ={{margin:15, flex:1}}>
          {/* container for user image */}
          <View style = {{alignSelf:"center"}}>
            <View>
              <Image source = {{uri:`https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,}} style = {styles.image} resizeMode ="cover"/>
            </View>
          </View>

          {/* name */}
          <Text style = {styles.username}>{faker.name.findName()}</Text>
          {/* rest of settings screen */}
          <SectionTitle
          title = 'Account'
          />

          <Setting
          title = "Security"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

        <Setting
          title = "Appearance"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

      <Setting
          title = "Connect a wallet"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />
          
      <Setting
          title = "2 factor Authentication"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />
                  
      <Setting
          title = "Log Out"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

        </ScrollView>
          {/* <View>
            <SectionTitle title={'Your Posts'}/>
            <SwipeListView
              data={userList}
              rightOpenValue={-75}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item}) => (
                <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:[item.pic], Currency:item.currency, Location: item.location})}>
                  <PostCard data ={item}/>
                </Pressable>
                )}
                renderHiddenItem = {({item}) => (
                  <View style={{ position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 75,
                  justifyContent: 'center',
                  alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>deleteRow(item)}>
                      <Ionicons size={30} name='trash-outline' color={"red"}/>
                    </TouchableOpacity>
                  </View>
               )}
            /> 
          </View> */}
      </View>
      
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    image:{
      width: 175,
      height: 175,
      borderRadius: 100,
      overflow: 'hidden',
      paddingBottom: 50,
    },
    username: {
      alignSelf:"center",
      fontSize:20,
    }
  });