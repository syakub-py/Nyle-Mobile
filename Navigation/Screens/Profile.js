import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from './Components/PostCard.js';
import {SwipeListView} from 'react-native-swipe-list-view';
import {firestore, getstorage} from './Components/Firebase'
import firebase from "firebase/compat/app";
import * as ImagePicker from "expo-image-picker";
import {getSoldItems, generateRating, getProfilePicture, AddProfilePicture} from "./GlobalFunctions";
import _ from "lodash";

/*
  @route.params = {profilePicture: url of the profile, username: current username}
*/

const getPosts = async (username, setUserList) => {
  let results = [];
  const MyPostsQuery = firestore.collection('AllPosts').where("PostedBy", "==", username);
  try {
    const postSnapshot = await MyPostsQuery.get();
    postSnapshot.forEach(doc => {
      results.push(doc.data());
    });
    setUserList(results);
  } catch (error) {
    Alert.alert('Error Getting Posts:', error);
  }
};

const onRefresh = async (setRefreshing, username, setUserList) => {
  setRefreshing(true);
  await getPosts(username, setUserList);
  Vibration.vibrate(100);

  setTimeout(() => setRefreshing(false), 1000);
};

const handleSignOut = async (navigation) => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
  return navigation.navigate("Login");
};

const deletePost = (item, collectionName, setRefreshing, username, setUserList) => {
  firestore
      .collection(collectionName)
      .doc(item.title)
      .delete()
      .then(() => {
        // delete each image
        item.pic.forEach((picture, index) => {
          const picRef = getstorage.refFromURL(picture);
          picRef
              .delete()
              .then(() => {
              })
              .catch((error) => {
                console.log("Error deleting picture:", error);
              });
        });
        Alert.alert("Posted deleted!");
        onRefresh(setRefreshing, username, setUserList);
      })
      .catch((error) => {
        console.log("Error deleting document: " + JSON.stringify(error));
      });
};

const clearDeleted = async (setRefreshing, username, setUserList) => {
  const sourceDocRef = firestore.collection("DeletedPosts");
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const query = sourceDocRef.where('date', '<', thirtyDaysAgo);
  try {
    const snapshot = await query.get();
    const batch = firestore.batch();
    snapshot.forEach((doc) => {
      deletePost(doc.data(), "DeletedPosts", setRefreshing, username, setUserList);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error clearing deleted posts:', error);
  }
};

const markAsSold = (item, setRefreshing, username, setUserList) => {
  firestore.collection("AllPosts").doc(item.title).update({ sold: "true" })
      .then(() => {
        onRefresh(setRefreshing, username, setUserList);
      })
      .catch((error) => {
        console.log(error);
      });
};

const moveToDelete = async (item, setRefreshing, username, setUserList) => {
  try {
    // Get the source document
    const sourceDocRef = firestore.collection("AllPosts").doc(item.title);
    const sourceDoc = await sourceDocRef.get();

    // Get the data from the source document
    const sourceData = sourceDoc.data();

    // Create a reference to the destination collection
    const destinationCollectionRef = firestore.collection("DeletedPosts").doc(item.title);

    // Create a new document in the destination collection with the source document data
    await destinationCollectionRef.set(sourceData);

    await sourceDocRef.delete();
    onRefresh(setRefreshing, username, setUserList);
  } catch (error) {
    console.error('Error moving document:', error);
  }
};

const SelectProfilePic = async (username) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
      await AddProfilePicture(username, result.assets[0].uri)
  }
};

export default function Profile({ navigation, route }) {
  const [userList, setUserList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const [profilePic, setProfilePic] = useState(null)


  useEffect(() => {
    getPosts(route.params.username, setUserList);
    clearDeleted(setRefreshing, route.params.username, setUserList);
    generateRating(route.params.username, setRating, setNumOfReviews)
    getProfilePicture(route.params.username).then((result)=>{
      setProfilePic(result)
    })
  }, []);


  const SectionTitle = ({title}) => {
    return (
      <View style = {{marginTop: 20, marginLeft:10}}>
        <Text style = {{color: 'black', fontSize:20, fontWeight:'bold'}}>{title}</Text>
      </View>
    )
  }
  
  const Setting = ({title, nameOfIcon,type, onPress}) => {
    if (type !== "button") return <View/>
    else {
      return (
        <TouchableOpacity style = {{flexDirection: 'row', height:50, alignItems:'center', width:'100%', marginLeft:20}} onPress = {onPress}>
          <View style = {{flexDirection:'row'}}>
            <Ionicons name = {nameOfIcon} style = {{color:'black', marginRight: 20}} size = {25}/>
            <Text style = {{flex:1, color:'black', fontSize: 16, fontWeight:'bold'}}>{title}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }
 
  return (
    <View style = {{backgroundColor:'white'}}>
        <SwipeListView
          data = {userList}
          rightOpenValue = {-170}
          refreshControl = {
            <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh(setRefreshing, route.params.username, setUserList)} />
          }
          ListFooterComponent = {
            <View style = {{height:80}}>

            </View>
          }
          ListHeaderComponent = {
            <View>
              <View>
                <Text style={{marginTop:25, fontSize:27, fontWeight:'bold', marginLeft:20}}>Settings</Text>

                <View style = {{alignItems:'center'}}>
                  <Pressable onPress={()=>{SelectProfilePic(route.params.username)}}>
                    <Image source = {{uri:profilePic}} style = {styles.image} resizeMode = "cover"/>
                    <View style = {{backgroundColor:'black', height:25, width:25, borderRadius:20, zIndex:1, position: 'absolute',  bottom: 15, left:15, justifyContent:'center', alignItems:'center'}}>
                      <Ionicons name = {'add-outline'} color = {'white'} size = {19}/>
                    </View>
                  </Pressable>
                </View>

                <View style = {{flexDirection:'row', alignSelf:'center', paddingTop:10}}>
                  <Pressable onPress = {() => {navigation.navigate("Reviews", {username:route.params.username, currentUser:route.params.username})}}>
                    <View style = {{flexDirection:'column', alignItems:'center'}}>
                      <Ionicons size = {20} name = {'star'} color = {'#ebd61e'}/>
                      <Text style = {{fontSize:17, fontWeight:'bold', paddingRight:5}}>{rating.toFixed(1)}</Text>
                    </View>
                  </Pressable>
                  <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%', marginLeft:10, marginRight:10}} />

                  <View style = {{flexDirection:'column', alignItems:'center'}}>
                    <Text style = {{fontSize:20, fontWeight:'500'}}>{_.size(userList)}</Text>
                    <Text style = {{fontSize:15, fontWeight:'400', color:'lightgray'}}>Total Items</Text>
                  </View>

                  <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%',marginLeft:10, marginRight:10}} />

                  <View style = {{flexDirection:'column', alignItems:'center'}}>
                    <Text style = {{fontSize:20, fontWeight:'500'}}>{getSoldItems(userList)}</Text>
                    <Text style = {{fontSize:15, fontWeight:'400', color:'lightgray'}}>Sold items</Text>
                  </View>
                </View>

              </View>


                <Setting
                  title = "Wallet(s)"
                  type = "button"
                  onPress = {() => navigation.navigate("Connected Wallets")}
                  nameOfIcon = "wallet-outline"
                />

                <Setting
                  title = "Security and Privacy"
                  type = "button"
                  onPress = {() => navigation.navigate("Edit Profile")}
                  nameOfIcon ='person-outline'
                />

                <Setting
                  title = "Log Out"
                  type = "button"
                  onPress = {()=>handleSignOut(navigation)}
                  nameOfIcon = 'log-out-outline'
                />

              <Setting
                  title = "Recently Deleted Posts"
                  type = "button"
                  onPress = {() =>navigation.navigate("Deleted Posts", {username:route.params.username})}
                  nameOfIcon = 'trash-outline'
              />

              <Setting
                  title = "Terms of Service"
                  type = "button"
                  onPress = {() => {navigation.navigate("Terms of Service", {showButtons:false})}}
                  nameOfIcon = 'alert-circle-outline'
              />
              
              <SectionTitle title = {'Posts'}/>
            </View>
            }

          renderItem = {({item}) => (
            <Pressable onPress = {() => navigation.navigate("post details", {CurrentUserProfilePic:profilePic, username:route.params.username, item})}>
              <PostCard data = {item}/>
            </Pressable>
            )}

          renderHiddenItem = {({item}) => (
              <View style = {{ position: 'absolute',
              flexDirection:'row',
              top: 0,
              right: 70,
              bottom: 0,
              width: 100,
              alignItems: 'center'}}>
                <TouchableOpacity onPress = {() =>moveToDelete(item, setRefreshing, route.params.username, setUserList)} style = {{marginRight:20}}>
                  <Ionicons size = {30} name ='trash-outline' color = {"red"}/>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() =>navigation.navigate("Edit Post", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, collectionPath:"AllPosts"})}>
                  <Ionicons size = {30} name ='create-outline' color = {"black"}/>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() =>markAsSold(item, setRefreshing, route.params.username, setUserList)}>
                  <Ionicons name = {'checkmark-circle-outline'} color = {"green"} size = {30} style = {{marginLeft:20}}/>
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
      borderRadius: 20,
      overflow: 'hidden',
      paddingBottom: 50,
      margin:20
    },

  });


//   <View style = {{marginTop:20}}>
//   <Text style = {{color: 'black', fontSize:18, fontWeight:'bold'}}>Recent Transactions</Text>
//   <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
//     {
//       transactions.map((item, index) =>(
//         <View style = {{height:150, width:150, margin:10, shadowColor:'black',elevation:3}} key = {index}>
//           <ImageBackground source = {{uri:item.pic}}  imageStyle = {{height:150, width:"100%",borderRadius:20}} resizeMode = {'cover'}>
//             <View style = {{flexDirection:'row', paddingHorizontal:5, paddingTop:3}}>
//               <Avatar source = {{uri: item.profilePic}} rounded/>
//               <Text style = {{color:'white', fontWeight:'bold', paddingHorizontal:10, paddingTop:5}}>{item.title}</Text>
//             </View>
//             <View style = {{flexDirection:'row', alignItems:'center', paddingHorizontal:10}}>
//               <Image style = {{height:15, width:15, marginRight:3, marginLeft:3}} source = {{uri:item.currency}}/>
//               <Text style = {{color:'white',}}>{item.price}</Text>
//             </View>
//           </ImageBackground>
//         </View>
//       ))
//     }
//   </ScrollView>
// </View>
