import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  Text,
  Vibration,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from '../Components/PostCard.js';
import {SwipeListView} from 'react-native-swipe-list-view';
import {firestore} from '../Components/Firebase';
import firebase from 'firebase/compat/app';
import * as ImagePicker from 'expo-image-picker';
import _ from 'lodash';
import HiddenButton from '../Components/HiddenButton';
import RatingButton from '../Components/RatingButton';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../Contexts/NyleContext';
import {UserContext} from '../Contexts/UserContext';
import Setting from '../Components/ProfileComponents/Setting';
import SectionTitle from '../Components/ProfileComponents/SectionTitle';

const handleSignOut = async (navigation, userContext) => {
  try {
    await firebase.auth().signOut();
    await userContext.clearUserData();
  } catch (error) {
    console.error(error);
  }
  return navigation.navigate('Login');
};

const clearDeletedAfter30Days = async () => {
  const nyleContext = useContext(AppContext);
  const sourceDocRef = firestore.collection('DeletedPosts');
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const query = sourceDocRef.where('date', '<', thirtyDaysAgo);
  try {
    const snapshot = await query.get();
    const batch = firestore.batch();
    snapshot.forEach((doc) => {
      nyleContext.deletePost(doc.data());
    });
    await batch.commit();
  } catch (error) {
    console.error('Error clearing deleted posts:', error);
  }
};

const moveToDeleteCollection = async (item, userPostsList) => {
  try {
    const sourceDocRef = firestore.collection('AllPosts').doc(item.title);
    const sourceDoc = await sourceDocRef.get();
    const sourceData = sourceDoc.data();
    const destinationCollectionRef = firestore.collection('DeletedPosts').doc(item.title);
    await destinationCollectionRef.set(sourceData);
    await sourceDocRef.delete();
    return userPostsList.filter((post) =>(post.id!==item.id));
  } catch (error) {
    console.error('Error moving document to delete collection:', error);
    return userPostsList;
  }
};

const selectProfilePic = async (userContext) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    await userContext.addProfilePicture(userContext.username, result.assets[0].uri);
  }
};

export default function Profile() {
  const [userPostsList, setUserPostsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const userContext = useContext(UserContext);


  useEffect(()=>{
    setRefreshing(true);
    Promise.all([
      clearDeletedAfter30Days(),
    ]).then(()=>{
      setUserPostsList(userContext.posts);
      setRefreshing(false);
    });
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await userContext.getPosts().then(()=>{
      Vibration.vibrate(10);
      setUserPostsList(userContext.posts);
      setRefreshing(false);
    });
  };


  return (
    <View style = {{backgroundColor: 'white', flex: 1}}>
      <SwipeListView
        data = {userPostsList}
        rightOpenValue = {-170}
        refreshControl = {
          <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh()} />
        }
        ListFooterComponent = {
          <View style = {{height: 80}}/>
        }
        ListHeaderComponent = {
          <View>
            <View>
              <View style = {{alignItems: 'center', marginTop: 25}}>
                <Pressable onPress={()=>{
                  selectProfilePic(userContext);
                }}>
                  <Image source = {{uri: userContext.profilePicture}} style = {{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    overflow: 'hidden',
                    paddingBottom: 50,
                    margin: 20,
                  }} resizeMode = "cover"/>
                  <View style = {{backgroundColor: 'black', height: 25, width: 25, borderRadius: 20, zIndex: 1, position: 'absolute', bottom: 15, left: 15, justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name = {'add-outline'} color = {'white'} size = {19}/>
                  </View>
                </Pressable>
              </View>

              <View style = {{flexDirection: 'row', alignSelf: 'center', paddingTop: 10}}>
                <View style={{flexDirection: 'column'}}>
                  <RatingButton rating={userContext.rating} username={userContext.username} currentUsername={userContext.username}/>

                  <Text style={{fontSize: 13, color: 'gray'}}>({userContext.numberOfReviews} reviews)</Text>
                </View>
                <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%', marginLeft: 10, marginRight: 10}} />

                <View style = {{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style = {{fontSize: 20, fontWeight: '500'}}>{_.size(userPostsList)}</Text>
                  <Text style = {{fontSize: 15, fontWeight: '400', color: 'lightgray'}}>Total Items</Text>
                </View>

                <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%', marginLeft: 10, marginRight: 10}} />

                <View style = {{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style = {{fontSize: 20, fontWeight: '500'}}>{userContext.amountOfSoldItems}</Text>
                  <Text style = {{fontSize: 15, fontWeight: '400', color: 'lightgray'}}>Sold items</Text>
                </View>
              </View>

            </View>

            <Setting
              title = "Wallet(s)"
              type = "button"
              onPress = {() => navigation.navigate('Connected Wallets')}
              nameOfIcon = "wallet-outline"
            />

            <Setting
              title = "Security and Privacy"
              type = "button"
              onPress = {() => navigation.navigate('Edit Profile')}
              nameOfIcon ='person-outline'
            />

            <Setting
              title = "Log Out"
              type = "button"
              onPress = {()=>handleSignOut(navigation, userContext)}
              nameOfIcon = 'log-out-outline'
            />

            <Setting
              title = "Recently Deleted Posts"
              type = "button"
              onPress = {() =>navigation.navigate('Deleted Posts')}
              nameOfIcon = 'trash-outline'
            />

            <Setting
              title = "Terms of Service"
              type = "button"
              onPress = {() => {
                navigation.navigate('Terms of Service', {showButtons: false});
              }}
              nameOfIcon = 'alert-circle-outline'
            />

            <SectionTitle title = {'Your Posts'}/>
          </View>
        }

        renderItem = {({item}) => (
          <PostCard post = {new Post(item)} />
        )}

        renderHiddenItem = {({item}) => (
          <View style = {{position: 'absolute',
            flexDirection: 'row',
            top: 0,
            right: 70,
            bottom: 0,
            width: 100,
            alignItems: 'center'}}>
            <HiddenButton color={'red'} onPress = {() =>setUserPostsList(moveToDeleteCollection(item, userPostsList))} iconName={'trash-outline'}/>
            <HiddenButton color={'black'} onPress = {() =>{}} iconName={'create-outline'}/>
          </View>
        )
        }
      />
    </View>
  );
}
