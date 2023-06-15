import React, {useState, useEffect} from 'react';
import {Alert, Pressable, RefreshControl, TouchableOpacity,Text, View} from 'react-native';
import PostCard from './Components/PostCard.js';
import {firestore, getstorage} from './Components/Firebase'
import Ionicons from "react-native-vector-icons/Ionicons";
import {SwipeListView} from 'react-native-swipe-list-view';

/*
    @route.params = {username:current username}
* */

export default function DeletedPosts({route, navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const [deletedPostList, setDeletedPostList] = useState([]);

    const getPosts = async () => {
        const results = [];
        const MyPostsQuery =  firestore.collection('DeletedPosts').where("PostedBy", "== ", route.params.username)
        await MyPostsQuery.get().then(postSnapshot => {
            postSnapshot.forEach(doc => {
                results.push(doc.data())
            });
        })
        return results;
    }
    
    const onRefresh = () => {
        setRefreshing(true);
        getPosts().then((result) => {
            setDeletedPostList(result);
        }).catch((error) => {
            Alert.alert('Error Getting Posts: ', error)
        })
        setTimeout(() => setRefreshing(false), 1000);
    };

    const deletePost = (item) => {
        firestore
            .collection("DeletedPosts")
            .doc(item.title)
            .delete()
            .then(() => {
                //delete each image
                item.pic.forEach((picture, index) => {
                    const picRef = getstorage.refFromURL(picture);
                    picRef
                        .getMetadata()
                        .then(() => {
                            // Picture exists in storage, proceed with deletion
                            picRef
                                .delete()
                                .then(() => {
                                })
                                .catch((error) => {
                                    console.log("Error deleting picture:", error);
                                });
                        })
                        .catch((error) => {
                            // Picture does not exist in storage
                            console.log("Picture does not exist:", error);
                        });
                });
                Alert.alert("Posted deleted!");
                onRefresh();
            })
            .catch((error) => {
                console.log("Error deleting document: " + JSON.stringify(error));
            });
    };

    const restoreItem = async (item) => {
        try {
            // Get the source document
            const sourceDocRef = firestore.collection("DeletedPosts").doc(item.title);
            const sourceDocSnapshot = await sourceDocRef.get();

            if (sourceDocSnapshot.exists) {
                // Get the data from the source document
                const sourceData = sourceDocSnapshot.data();

                // Create a reference to the destination collection
                const destinationCollectionRef = firestore.collection("AllPosts").doc(item.title);

                // Create a new document in the destination collection with the source document data
                await destinationCollectionRef.set(sourceData);

                // Delete the source document
                await sourceDocRef.delete();

                // Perform the necessary actions after restoration (e.g., refresh UI)
                onRefresh();
            }
        } catch (error) {
            console.error('Error restoring document:', error);
        }
    };

    const deleteAllPosts = () => {
        deletedPostList.forEach((doc , index) => {
            deletePost(doc)
        })
    }

    useEffect(() => {
        getPosts().then((result) => {
            setDeletedPostList(result);
        }).catch((error) => {
            Alert.alert('Error Getting Posts: ', error)
        })
    }, [])

    return (
        <View style = {{flex:1}}>
            <SwipeListView
                data = {deletedPostList}
                rightOpenValue = {-140}
                ListHeaderComponent= {
                <View style = {{marginTop:10}}>

                    <View style = {{flexDirection:'row'}}>
                        <View style = {{ height:50, width:50, margin:10, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:"10%"}}>
                            <Pressable onPress = {() =>navigation.goBack()}>
                                <Ionicons name ='arrow-back-outline' size = {35}/>
                            </Pressable>
                        </View>
                        <Text style = {{alignSelf:'center', fontWeight:'bold'}}>Posts will get deleted after 30 days</Text>
                    </View>

                    <Pressable onPress = {() => {deleteAllPosts()}}>
                        <View style = {{width:100, backgroundColor:'black', margin:10, borderRadius:5}}>
                            <Ionicons name = {"trash"} size = {30} style = {{color:'white', alignSelf:'center'}}/>
                        </View>
                    </Pressable>
                </View>
                }
                  refreshControl = {
                      <RefreshControl refreshing= {refreshing} onRefresh= {onRefresh} />
                  }
                  renderItem = {({item}) => (
                      <PostCard data = {item} username = {route.params.username}/>
                  )}
                renderHiddenItem = {({item}) => (
                    <View style = {{ position: 'absolute',
                        flexDirection:'row',
                        top: 0,
                        right: 70,
                        bottom: 0,
                        width: 60,
                        alignItems: 'center'}}>
                        <TouchableOpacity onPress = {() =>deletePost(item)} style = {{marginRight:20}}>
                            <Ionicons size = {30} name ='trash-outline' color = {"red"}/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress = {() => {restoreItem(item)}}>
                            <Ionicons size = {30} name ='arrow-redo-outline' color = {"lightblue"}/>
                        </TouchableOpacity>


                    </View>
                )
                }
                  keyExtractor = {item => item.id}/>
        </View>
    )



}
