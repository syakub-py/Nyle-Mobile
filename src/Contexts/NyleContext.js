import {firestore, getstorage} from '../Components/Firebase';
import {Alert} from 'react-native';
import {createContext} from 'react';
import {Post} from './PostContext';

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

