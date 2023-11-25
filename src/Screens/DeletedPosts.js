import React, {useState, useEffect, useContext} from 'react';
import {Pressable, RefreshControl, Text, View} from 'react-native';
import PostCard from '../Components/PostCard.js';
import {firestore} from '../Components/Firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SwipeListView} from 'react-native-swipe-list-view';
import HiddenButton from '../Components/HiddenButton';
import {AppContext} from '../Contexts/NyleContext';
import {UserContext} from '../Contexts/UserContext';
import {useNavigation} from '@react-navigation/native';

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


export default function DeletedPosts() {
  const [refreshing, setRefreshing] = useState(false);
  const [deletedPostList, setDeletedPostList] = useState([]);
  const userContext = useContext(UserContext);
  const nyleContext =useContext(AppContext);
  const navigation = useNavigation();

  useEffect(() => {
    setRefreshing(true);
    userContext.getDeletedPosts().then(()=>{
      setRefreshing(false);
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    userContext.getDeletedPosts().then(()=>{
      setRefreshing(false);
    });
  };

  const deleteAllPosts = () => {
    deletedPostList.forEach((post) => {
      nyleContext.deletePost(post);
    });
  };

  return (
    <View style = {{flex: 1}}>
      <SwipeListView
        data = {userContext.deletedPosts}
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

            <Pressable onPress = {() => deleteAllPosts()}>
              <View style = {{width: 100, backgroundColor: 'black', margin: 10, borderRadius: 5}}>
                <Ionicons name = {'trash'} size = {30} style = {{color: 'white', alignSelf: 'center'}}/>
              </View>
            </Pressable>

          </View>
        }
        refreshControl = {
          <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh()} />
        }
        renderItem = {({item}) => (
          <PostCard title = {item.title}/>
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
              <HiddenButton iconName={'trash-outline'} color={'red'} onPress = {() => nyleContext.deletePost(item)}/>
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
