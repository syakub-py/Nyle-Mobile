import React, {useState, useEffect} from 'react';
import {Alert, Image, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from './Components/PostCard.js';
import {SwipeListView} from 'react-native-swipe-list-view';
import {firestore, getstorage} from './Components/Firebase'
import firebase from "firebase/compat/app";
import * as ImagePicker from "expo-image-picker";

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
    try {
      // Fetch the image and create a blob
      const response = await fetch(result.assets[0]);
      const blob = await response.blob();

      // Get a reference to the storage location for the profile image
      const storageRef = getstorage.ref(`ProfilePictures/${username}`);

      // Upload the new image to Firebase Storage
      await storageRef.put(blob);

      // Get the download URL for the uploaded image
      const url = await storageRef.getDownloadURL();

      // Find the document in the ProfilePictures collection that corresponds to the current user's profile image
      const profilePicRef = firestore.collection('ProfilePictures').where('FileName', '==', username);

      // Update the URL for the profile image in the Firestore document
      profilePicRef.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Create the document if it doesn't exist
          firestore.collection('ProfilePictures').add({ FileName: username, url })
              .then(() => {
              })
              .catch((error) => {
                console.error('Error creating profile picture:', error);
              });
        } else {
          querySnapshot.forEach((doc) => {
            doc.ref.update({ url })
                .then(() => {
                })
                .catch((error) => {
                  console.error('Error updating profile picture:', error);
                });
          });
        }
      }).catch((error) => {
        console.error('Error getting document:', error);
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  }
};

export default function Profile({ navigation, route }) {
  const [userList, setUserList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getPosts(route.params.username, setUserList);
    clearDeleted(setRefreshing, route.params.username, setUserList);
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
              <View style = {{alignSelf:"flex-start", flexDirection:'row',  width:'100%', borderBottomLeftRadius:10, borderBottomRightRadius:10, marginTop:35}}>
                    <Pressable onPress={()=>{SelectProfilePic(route.params.username)}}>
                      <Image source = {{uri:route.params.profilePicture}} style = {styles.image} resizeMode = "cover"/>
                      <View style = {{backgroundColor:'black', height:25, width:25, borderRadius:20, zIndex:1, position: 'absolute',  bottom: 15, left:15, justifyContent:'center', alignItems:'center'}}>
                        <Ionicons name = {'add-outline'} color = {'white'} size = {19}/>
                      </View>
                    </Pressable>

                    <Text style = {{color:'black',alignSelf:"center",fontSize:20, fontWeight:'bold'}}>{route.params.username.slice(0, 15) + "..."}</Text>
              </View>

                <SectionTitle
                title = 'Account Settings'
                />


                <Setting
                  title = "Wallet(s)"
                  type = "button"
                  onPress = {() => navigation.navigate("Connected Wallets")}
                  nameOfIcon = "wallet-outline"
                />

                <Setting
                  title = "Edit Profile"
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
                  title = "Your Reviews"
                  type = "button"
                  onPress = {() =>navigation.navigate("Reviews", {username:route.params.username, currentUser:route.params.username})}
                  nameOfIcon = 'star-outline'
              />

              <Setting
                  title = "Terms of Service"
                  type = "button"
                  onPress = {() => {navigation.navigate("Terms of Service", {showButtons:false})}}
                  nameOfIcon = 'alert-circle-outline'
              />
              
              <SectionTitle title = {'Your Posts'}/>
            </View>
            }

          renderItem = {({item}) => (
            <Pressable onPress = {() => navigation.navigate("post details", {CurrentUserProfilePic:route.params.profilePicture, username:route.params.username, item})}>
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
