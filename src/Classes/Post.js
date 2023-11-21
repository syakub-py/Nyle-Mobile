import {firestore} from '../Components/Firebase';
import {Vibration} from 'react-native';
import CryptoDataService from '../Services/CryptoDataService';
import _ from 'lodash';

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

  updateCurrencyPrice = async () => {
    let price = 0;
    try {
      const response = await CryptoDataService.getMarketData();
      const filteredData = response.data.filter((item) => item.image === this.currencies[0].value);
      if (!_.isEmpty(filteredData)) {
        price = filteredData[0].current_price;
      }
    } catch (error) {
      console.log(error.message);
    }
    const postRef = firestore.collection('AllPosts').doc(this.title);
    postRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.hasOwnProperty('USD') && price !== 0) {
          postRef.update({USD: (price * data.currencies[0].price).toFixed(2).toString()});
        } else {
          if (price !== 0) {
            postRef.set({USD: (price * data.currencies[0].price).toFixed(2).toString()}, {merge: true});
          }
        }
      }
    });
  };

  updatedCurrencyList = () =>{
    if (_.size(this.currencies)>1) {
      return this.currencies;
    } else {
      return this.currencies;
    }
  };
}
