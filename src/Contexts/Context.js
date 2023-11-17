import {firestore, getstorage} from '../Components/Firebase';
import {Alert, Vibration} from 'react-native';
import {createContext} from 'react';

class Post {
  constructor(postData) {
    this.postedBy = postData.postedBy || '';
    this.sqft = postData.sqft || 0;
    this.usd = postData.usd || 0;
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
  handleLike = async (username, Liked, setLiked) => {
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

  upload = async (PhoneImagesArray) => {
    const UrlDownloads = [];
    try {
      for (const element of PhoneImagesArray) {
        const filename = element.split('/').pop();
        const response = await fetch(element);
        const blob = await response.blob();
        const storageRef = getstorage.ref().child(`images/${this.title}/${filename}`);
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
}

export class NyleContext {
  constructor() {
    this.PostContextArray;
    this.lastDocument;
  }
  // addPost = async (collectionPath, Post) => {
  //   if (!collectionPath) throw new Error('Error: collection name cannot be empty');
  //
  //   Post.imageUrls = await this.upload(Post.imageUrls, Post.title);
  //
  //   return firestore.collection(collectionPath).doc(Post.title).set(Post)
  //       .then((ref) => {
  //         Alert.alert('Post added');
  //       })
  //       .catch((error) => {
  //         console.log('Error adding document: ', error);
  //       });
  // };

  deletePost = (Post) => {
    this.PostContextArray.filter((post) =>(post.title!==Post.title));
    firestore
        .collection('DeletedPosts')
        .doc(Post.title)
        .delete()
        .then(() => {
          Post.pictures.forEach((picture, index) => {
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
