import React, {useState, useEffect} from 'react';
import {Alert, Pressable, RefreshControl, Text, View} from 'react-native';
import PostCard from '../Components/PostCard.js';
import {firestore, getstorage} from '../Components/Firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SwipeListView} from 'react-native-swipe-list-view';
import HiddenButton from '../Components/HiddenButton';


const getPosts = async (username, setDeletedPostList) => {
  const results = [];
  const MyPostsQuery = firestore.collection('DeletedPosts').where('PostedBy', '==', username);
  try {
    await MyPostsQuery.get().then((postSnapshot) => {
      postSnapshot.forEach((doc) => {
        results.push(doc.data());
      });
    });
    setDeletedPostList(results);
  } catch (error) {
    Alert.alert('Error Getting Posts: ', error);
  }
};

const onRefresh = (username, setRefreshing, setDeletedPostList) => {
  setRefreshing(true);
  getPosts(username, setDeletedPostList);
  setTimeout(() => setRefreshing(false), 1000);
};

const deletePost = (item, deletedPostList, setDeletedPostList) => {
  setDeletedPostList(deletedPostList.filter((post) =>(post.title!==item.title)));
  firestore
      .collection('DeletedPosts')
      .doc(item.title)
      .delete()
      .then(() => {
        item.pic.forEach((picture, index) => {
          const picRef = getstorage.refFromURL(picture);
          picRef
              .getMetadata()
              .then(() => {
                picRef
                    .delete()
                    .then(() => {
                    })
                    .catch((error) => {
                      console.log('Error deleting picture:', error);
                    });
              })
              .catch((error) => {
                console.log('Picture does not exist:', error);
              });
        });
        Alert.alert('Posted deleted!');
      })
      .catch((error) => {
        console.log('Error deleting document: ' + JSON.stringify(error));
      });
};

const restoreItem = async (item, deletedPostList, setDeletedPostList) => {
  setDeletedPostList(deletedPostList.filter((post) =>(post.title!==item.title)));
  try {
    const sourceDocRef = firestore.collection('DeletedPosts').doc(item.title);
    const sourceDocSnapshot = await sourceDocRef.get();

    if (sourceDocSnapshot.exists) {
      const sourceData = sourceDocSnapshot.data();

      const destinationCollectionRef = firestore.collection('AllPosts').doc(item.title);

      await destinationCollectionRef.set(sourceData);

      await sourceDocRef.delete();
    }
  } catch (error) {
    console.error('Error restoring document:', error);
  }
};

const deleteAllPosts = ( deletedPostList, setDeletedPostList) => {
  deletedPostList.forEach((post) => {
    deletePost(post, deletedPostList, setDeletedPostList);
  });
};

export default function DeletedPosts({route, navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [deletedPostList, setDeletedPostList] = useState([]);
  const username= route.params.username;

  useEffect(() => {
    getPosts(username, setDeletedPostList);
  }, []);

  return (
    <View style = {{flex: 1}}>
      <SwipeListView
        data = {deletedPostList}
        rightOpenValue = {-140}
        ListHeaderComponent = {
          <View style = {{marginTop: 10}}>

            <View style = {{flexDirection: 'row'}}>
              <View style = {{height: 50, width: 50, margin: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: '10%'}}>
                <Pressable onPress = {() =>navigation.goBack()}>
                  <Ionicons name ='arrow-back-outline' size = {35}/>
                </Pressable>
              </View>
              <Text style = {{alignSelf: 'center', fontWeight: 'bold'}}>Posts will get deleted after 30 days</Text>
            </View>

            <Pressable onPress = {() => {
              deleteAllPosts(deletedPostList, setDeletedPostList);
            }}>
              <View style = {{width: 100, backgroundColor: 'black', margin: 10, borderRadius: 5}}>
                <Ionicons name = {'trash'} size = {30} style = {{color: 'white', alignSelf: 'center'}}/>
              </View>
            </Pressable>

          </View>
        }
        refreshControl = {
          <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh(username, setRefreshing, setDeletedPostList)} />
        }
        renderItem = {({item}) => (
          <PostCard data = {item} username = {username}/>
        )}
        renderHiddenItem = {({item}) => (
          <View style = {{position: 'absolute',
            flexDirection: 'row',
            top: 0,
            right: 70,
            bottom: 0,
            width: 60,
            alignItems: 'center'}}>
            <View style = {{marginRight: 20}}>
              <HiddenButton iconName={'trash-outline'} color={'red'} onPress = {() => deletePost(item, deletedPostList, setDeletedPostList)}/>
            </View>

            <View>
              <HiddenButton iconName={'arrow-redo-outline'} color={'lightblue'} onPress = {()=> restoreItem(item, deletedPostList, setDeletedPostList)}/>
            </View>
          </View>
        )}
        keyExtractor = {(item) => item.id}/>
    </View>
  );
}
