import {firestore, getstorage} from '../Components/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import _ from 'lodash';
import {createContext} from 'react';

class User {
  constructor() {
    this.username = '';
    this.profilePicture = '';
    this.reviews = [];
    this.posts = [];
    this.rating = 0;
    this.numberOfReviews = 0;
    this.amountOfSoldItems = 0;
    this.deletedPosts = [];
    this.chats = [];
    this.initializeUserData();
  };

  initializeUserData = async () =>{
    try {
      this.username = await this.getUsername();
      await Promise.all([
        this.getPosts(),
        this.getProfilePicture(),
      ]);
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  getReviews = async () => {
    let results = [];
    const MyReviewsQuery = firestore.collection('Reviews').where('Reviewe', '==', this.username);
    await MyReviewsQuery.get().then((postSnapshot) => {
      postSnapshot.forEach((doc) => {
        results.push({id: doc.id, ...doc.data()});
      });
    });
    if (results) {
      results = results.sort((a, b) => {
        return new Date(b.DatePosted) - new Date(a.DatePosted);
      });
    }
    this.reviews = results;
  };

  addProfilePicture = async () => {
    try {
      const response = await fetch(this.profilePicture);
      const blob = await response.blob();
      const storageRef = getstorage.ref().child(`ProfilePictures/${this.username}`);
      await storageRef.put(blob);
      const url = await storageRef.getDownloadURL();

      const profilePicturesRef = firestore.collection('ProfilePictures');

      await profilePicturesRef.doc(this.username).set({
        url: url,
      });

      const PostsRef = firestore.collection('AllPosts');

      const querySnapshot = await PostsRef.where('profilePic', '==', this.username).get();

      if (querySnapshot.empty) {
        const batch = firestore.batch();
        querySnapshot.forEach((doc) => {
          const docRef = PostsRef.doc(doc.id);
          batch.update(docRef, {profilePic: url});
        });

        await batch.commit();
        console.log('Profile picture field updated successfully');
      }

      console.log('Profile picture added successfully');
    } catch (error) {
      console.log('Error adding profile picture:', error);
    }
  };

  getProfilePicture = async () => {
    try {
      const userRef = firestore.collection('ProfilePictures').doc(this.username);
      const doc = await userRef.get();
      if (doc.exists) {
        this.profilePicture = doc.data().url;
      } else {
        this.profilePicture= 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
      }
    } catch (error) {
      this.profilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    }
  };

  getUsername = async () =>{
    return await AsyncStorage.getItem('@username');
  };

  getAmountOfSoldItems = () => {
    let counter = 0;
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].sold === 'true') counter++;
    }
    this.amountOfSoldItems = counter;
  };

  generateRating = async () => {
    let sum = 0;
    let counter = 0;
    const MyReviewsQuery = firestore.collection('Reviews').where('Reviewe', '==', this.username);
    await MyReviewsQuery.get().then((postSnapshot) => {
      postSnapshot.forEach((doc) => {
        sum = sum + doc.data().stars;
        counter++;
      });
    });
    const rating = sum/counter;
    const numOfReviews = counter;
    this.rating = rating;
    this.numberOfReviews = numOfReviews;
  };

  getPosts = async () => {
    const results = [];
    const MyPostsQuery = firestore.collection('AllPosts').where('postedBy', '==', this.username);
    try {
      await MyPostsQuery.get().then((postSnapshot) => {
        postSnapshot.forEach((doc) => {
          results.push(doc.data());
        });
      });
      this.posts = results;
    } catch (error) {
      Alert.alert('Error Getting Posts: ', error);
    }
  };

  getDeletedPosts = async () => {
    const results = [];
    const MyPostsQuery = firestore.collection('DeletedPosts').where('postedBy', '==', this.username);
    try {
      await MyPostsQuery.get().then((postSnapshot) => {
        postSnapshot.forEach((doc) => {
          results.push(doc.data());
        });
      });
      this.deletedPosts = results;
    } catch (error) {
      Alert.alert('Error Getting Posts: ', error);
    }
  };

  getChats = async () => {
    const results = [];
    try {
      const MyChatQuery = firestore.collection('Chats');
      const ChatSnapshot = await MyChatQuery.get();
      const chatDocs = ChatSnapshot.docs;
      for (const doc of chatDocs) {
        if (doc.data().owners.some((item) => item.username === this.username)) {
          const latestMessageQuery = firestore.collection(`Chats/${doc.id}/messages`)
              .orderBy('createdAt', 'desc')
              .limit(1);

          const latestMessageSnapshot = await latestMessageQuery.get();
          const latestMessageDocs = latestMessageSnapshot.docs;

          if (!_.isEmpty(latestMessageDocs)) {
            const latestMessageData = latestMessageDocs[0].data();
            const latestMessage = latestMessageData.text;
            const received = latestMessageData.received;
            const image = !_.isEmpty(latestMessageData.image) ? latestMessageData.image[0] : '';

            const chatData = {
              data: doc.data(),
              id: doc.id,
              latestMessage,
              image,
              received,
            };

            if (latestMessageData.user.name === this.username) chatData.latestMessage = 'You: ' + latestMessage;

            results.push(chatData);
          } else {
            results.push({
              data: doc.data(),
              id: doc.id,
              latestMessage: '',
              image: '',
              received: true,
            });
          }
        }
      }
      this.chats = results;
    } catch (error) {
      console.log(error);
    }
  };

  deleteChat = async (chat) => {
    const docSnapshots = await firestore.collection('Chats').doc(chat.id).collection('messages').get();
    for (const doc of docSnapshots.docs) {
      if (!_.isEmpty(doc.data().image)) {
        for (const picture of doc.data().image) {
          const imageRef = getstorage.refFromURL(picture);
          await imageRef.delete();
        }
      }
    }
    this.chats.filter((item) =>(chat.id!==item.id));
    await firestore.collection('Chats').doc(chat.id).delete();
  };
}


export const UserContext = createContext(new User());
