import {firestore} from '../Components/Firebase';

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

export const generateOtherUsersRating = async (otherUsername, setRating, setNumberOfReviews) => {
  let sum = 0;
  let counter = 0;
  const MyReviewsQuery = firestore.collection('Reviews').where('Reviewe', '==', otherUsername);
  await MyReviewsQuery.get().then((postSnapshot) => {
    postSnapshot.forEach((doc) => {
      sum = sum + doc.data().stars;
      counter++;
    });
  });

  setRating(sum/counter);
  setNumberOfReviews(counter);
};

export const getProfileOtherPicture = async (username) => {
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
