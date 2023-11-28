import CryptoDataService from "../Services/CryptoDataService";
import { firestore } from "./Firebase";

export async function fetchPost(title) {
    const postRef = firestore.collection('AllPosts').doc(title);
    return await postRef.get();
}

export async function fetchMarketData() {
    const response = await CryptoDataService.getMarketData();
    return response.data;
  }

export async function processPostForLike(doc, username, setLiked, title, likes) {
	let updatedLikes;

    if (!doc.data().likes.includes(username)) {
		updatedLikes = [...likes, username];
		setLiked(true);
    } else {
		updatedLikes = likes.filter((user) => user !== username);
		setLiked(false);
	}
	await updatePostLikes(title, updatedLikes);
	return updatedLikes;
}

async function updatePostLikes(title, likes) {
    const postRef = firestore.collection('AllPosts').doc(title);
    try {
      await postRef.update({ likes });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
}

export async function updateViewCount (title, views) {
    const postRef = firestore.collection('AllPosts').doc(title);
    try {
      await postRef.update({ views });
    } catch (error) {
      console.error('Error updating views:', error);
    }
}

export async function updatePostWithCurrencyPrice(doc, price, title) {
    const data = doc.data();
    const postRef = firestore.collection('AllPosts').doc(title);
    if (data.hasOwnProperty('USD') && price !== 0) {
      await postRef.update({USD: (price * data.currencies[0].price).toFixed(2).toString()});
    } else if (price !== 0) {
      await postRef.set({USD: (price * data.currencies[0].price).toFixed(2).toString()}, {merge: true});
    }
}
