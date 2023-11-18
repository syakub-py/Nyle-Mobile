import {firestore} from '../Components/Firebase';
import {Vibration} from 'react-native';

export class Post {
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
