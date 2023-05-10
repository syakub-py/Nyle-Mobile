import * as React from 'react';
import { View, Text, StyleSheet,Alert, Switch, Image, TouchableOpacity, Pressable, RefreshControl} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from './Components/PostCard.js';
import { SwipeListView } from 'react-native-swipe-list-view';
import {firestore, getstorage} from './Components/Firebase'
import firebase from "firebase/compat/app";


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
    const MyPostsQuery =  firestore.collection('AllPosts').where("PostedBy", "==", route.params.username)
    await MyPostsQuery.get().then(postSnapshot =>{
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

  const handleSignOut = async () =>{
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
    return navigation.navigate("Login")
  }
  
  React.useEffect(()=>{
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      Alert.alert('Error Getting Posts: ', error)
    })
  }, [])

  const deletePost = (item) => {
    console.log("Deleting post:", item.title);
    firestore
        .collection("AllPosts")
        .doc(item.title)
        .delete()
        .then(() => {
          console.log("Deleted the Firestore data");
          //delete each image
          item.pic.forEach((picture, index) => {
            const picRef = getstorage.refFromURL(picture);
            picRef
                .delete()
                .then(() => {
                  console.log("Deleting image:", picRef.name);
                })
                .catch((error) => {
                  console.log("Error deleting picture:", error);
                });
          });
          Alert.alert("Posted deleted!");
          onRefresh();
        })
        .catch((error) => {
          console.log("Error deleting document: " + JSON.stringify(error));
        });
  };

  const markAsSold = (item) =>{
    firestore.collection("AllPosts").doc(item.title).update({sold:"true"}).then(()=>{
      console.log("marked as sold")
      onRefresh();
    }).catch((error)=>{
      console.log(error)
    })
  }
  return (
      <View style={{backgroundColor:'white'}}>
            <SwipeListView
              data={userList}
              rightOpenValue={-170}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent= {
                <View>
                  <Image source={require('../Screens/Components/icon.png')} style={{height:75, width:75, marginLeft:10, marginTop:10}}/>
                  <View style = {{alignSelf:"flex-start", flexDirection:'row',  width:'100%', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                        <Image source = {{uri:route.params.profilePic,}} style = {styles.image} resizeMode ="cover"/>
                        <Text style = {{color:'black',alignSelf:"center",fontSize:20, fontWeight:'bold'}}>{route.params.username}</Text>
                  </View>

                    <SectionTitle
                    title = 'Account Settings'
                    />

                    <Setting
                      title = "Appearance"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = 'eye-outline'
                    />

                    <Setting
                      title = "Wallet(s)"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = "wallet-outline"
                    />

                    <Setting
                      title = "Edit Profile"
                      type = "button"
                      onPress = {() => navigation.navigate("Edit Profile")}
                      nameOfIcon='person-outline'
                    />
                            
                    <Setting
                      title = "Log Out"
                      type = "button"
                      onPress = {handleSignOut}
                      nameOfIcon = 'log-out-outline'
                    />
                  
                  <SectionTitle title={'Your Posts'}/>
                </View>
                }
              renderItem={({item}) => (
                <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, coordinates:item.coordinates, Likes:item.likes})}>
                  <PostCard data ={item}/>
                </Pressable>
                )}
                renderHiddenItem = {({item}) => (
                  <View style={{ position: 'absolute',
                  flexDirection:'row',
                  top: 0,
                  right: 70,
                  bottom: 0,
                  width: 100,
                  alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>deletePost(item)} style={{marginRight:20}}>
                      <Ionicons size={30} name='trash-outline' color={"red"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>navigation.navigate("Edit Post", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, collectionPath:"AllPosts"})}>
                      <Ionicons size={30} name='create-outline' color={"black"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>markAsSold(item)}>
                      <Ionicons name={'checkmark-circle-outline'} color={"green"} size={30} style={{marginLeft:20}}/>
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

  });


//   <View style={{marginTop:20}}>
//   <Text style ={{color: 'black', fontSize:18, fontWeight:'bold'}}>Recent Transactions</Text>
//   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//     {
//       transactions.map((item, index) =>(
//         <View style={{height:150, width:150, margin:10, shadowColor:'black',elevation:3}} key={index}>
//           <ImageBackground source={{uri:item.pic}}  imageStyle={{height:150, width:"100%",borderRadius:20}} resizeMode={'cover'}>
//             <View style={{flexDirection:'row', paddingHorizontal:5, paddingTop:3}}>
//               <Avatar source={{uri: item.profilePic}} rounded/>
//               <Text style={{color:'white', fontWeight:'bold', paddingHorizontal:10, paddingTop:5}}>{item.title}</Text>
//             </View>
//             <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:10}}>
//               <Image style={{height:15, width:15, marginRight:3, marginLeft:3}} source={{uri:item.currency}}/>
//               <Text style={{color:'white',}}>{item.price}</Text>
//             </View>
//           </ImageBackground>
//         </View>
//       ))
//     }
//   </ScrollView>
// </View>