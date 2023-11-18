import {firestore, getstorage} from '../Components/Firebase';
import {Alert, Vibration} from 'react-native';
import {createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Post {
  constructor(postData) {
    this.postedBy = postData.postedBy || '';
    this.SQFT = postData.SQFT || 0;
    this.USD = postData.USD || 0;
    this.bathrooms = postData.bathrooms || 0;
    this.bedrooms = postData.bedrooms || 0;
    this.category = postData.category || '';
    this.coordinates = postData.coordinates || {};
    this.currencies = postData.currencies || '';
    this.date = postData.date || new Date().toLocaleString();
    this.description = postData.description || '';
    this.id = postData.id || '';
    this.likes = postData.likes || [];
    this.pictures = postData.pictures || [];
    this.profilePic = postData.profilePic || '';
    this.sold = postData.sold || false;
    this.title = postData.title || '';
    this.views = postData.views || 0;
  }
  handleLikeCounter = async (username, Liked, setLiked) => {
    const PostRef = firestore.collection('AllPosts').doc(this.title);
    PostRef.get()
        .then((doc) => {
          if (doc.exists && !doc.data().likes.includes(username)) {
            const likesArray = doc.data().likes || [];
            likesArray.push(username);
            PostRef.update({likes: likesArray})
                .then(() => {
                })
                .catch((error) => {
                  console.error('Error adding Like:', error);
                });
          } else {
            const likesArray = doc.data().likes || [];
            const updatedLikesArray = likesArray.filter((username) => username !== username);
            PostRef.update({likes: updatedLikesArray})
                .then(() => {
                })
                .catch((error) => {
                  console.error('Error removing like:', error);
                });
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
    setLiked(!Liked);
    Vibration.vibrate(100);
  };
  handleViewCounter = () => {
    const PostRef = firestore.collection('AllPosts').doc(this.title);
    return PostRef.get()
        .then((doc) => {
          const currentViews = doc.data().views;
          this.views = currentViews + 1;
          PostRef.update({views: this.views})
              .then(() => {
              })
              .catch((error) => {
                console.error('Error adding value to views:', error);
              });
          return currentViews;
        });
  };
}

class User {
  constructor() {
    this.username = '';
    this.profilePicture = '';
    this.reviews = [];
    this.posts = [];
    this.rating = 0;
    this.numberOfReviews = 0;
    this.amountOfSoldItems = 0;
    this.initializeUserData();
  };

  async initializeUserData() {
    try {
      this.username = await this.getUsername();
      await Promise.all([
        this.getReviews(),
        this.generateRating(),
        this.getPosts(),
        this.getProfilePicture(),
        this.getAmountOfSoldItems(),
      ]);
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  }

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
}

export class NyleContext {
  constructor() {
    this.PostContextArray;
    this.lastDocument;
  }

  upload = async (PhoneImagesArray, title) => {
    const UrlDownloads = [];
    try {
      for (const element of PhoneImagesArray) {
        const filename = element.split('/').pop();
        const response = await fetch(element);
        const blob = await response.blob();
        const storageRef = getstorage.ref().child(`images/${title}/${filename}`);
        await storageRef.put(blob);
        const url = await storageRef.getDownloadURL();
        UrlDownloads.push(url);
      }
      return UrlDownloads;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  addPost = async (collectionPath, Post) => {
    if (!collectionPath) throw new Error('Error: collection name cannot be empty');


    Post.pictures= await this.upload(Post.pictures, Post.title);

    return firestore.collection(collectionPath).doc(Post.title).set(Post)
        .then((ref) => {
          Alert.alert('Post added');
        })
        .catch((error) => {
          console.log('Error adding document: ', error);
        });
  };

  deletePost = (Post) => {
    this.PostContextArray.filter((post) =>(post.title!==Post.title));
    firestore
        .collection('DeletedPosts')
        .doc(Post.title)
        .delete()
        .then(() => {
          Post.pictures.forEach((picture) => {
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

  contextFor(postTitle) {
    return this.PostContextArray.find((post) =>post.title === postTitle);
  }

  readDatabase = async (
      collectionName,
  ) => {
    try {
      const postRef = firestore.collection(collectionName);

      const querySnapshot = await postRef.limit(2).get();

      this.PostContextArray = querySnapshot.docs.map((doc) => new Post(doc.data())).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (querySnapshot.docs.length > 0) {
        this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      return this.PostContextArray;
    } catch (error) {
      console.error(error);
    }
  };

  handleEndReached = async () => {
    const postRef = firestore.collection('AllPosts');
    let querySnapshot = null;
    if (this.lastDocument) {
      querySnapshot = await postRef
          .startAfter(this.lastDocument)
          .limit(2)
          .get();
    } else {
      querySnapshot = await postRef.limit(2).get();
    }

    const results = querySnapshot.docs.map((doc) => doc.data());
    this.PostContextArray = this.PostContextArray.concat(results);

    if (querySnapshot.docs.length > 0) {
      this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
  };
}


export const AppContext = createContext(new NyleContext());

export const UserContext = createContext(new User());
