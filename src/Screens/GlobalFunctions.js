import {firestore} from '../Components/Firebase';
import CryptoDataService from '../Services/CryptoDataService';
import _ from 'lodash';

export const updateCurrencyPrice = async (data) => {
  let price = 0;
  try {
    const response = await CryptoDataService.getMarketData();
    const filteredData = response.data.filter((item) => item.image === data.currencies[0].value);
    if (!_.isEmpty(filteredData)) {
      price = filteredData[0].current_price;
    }
  } catch (error) {
    console.log(error.message);
  }
  const postRef = firestore.collection('AllPosts').doc(data.title);
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

export const updatedCurrencyList = (currencyList) =>{
  if (_.size(currencyList)>1) {
    return currencyList;
  } else {
    return currencyList;
  }
};

export const isLiked = (likes, username) =>{
  return likes.includes(username);
};
export const categoryFilter = (text, masterData) => {
  if (text && text !== 'All') {
    return masterData.filter((item) => {
      const itemData = item.category ? item.category : '';
      return itemData.indexOf(text)>-1;
    });
  } else {
    return masterData;
  }
};

export const getProfilePicture = async (username) => {
  try {
    const userRef = firestore.collection('ProfilePictures').doc(username);
    const doc = await userRef.get();
    if (doc.exists) {
      return doc.data().url;
    } else {
      return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    }
  } catch (error) {
    return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  }
};
