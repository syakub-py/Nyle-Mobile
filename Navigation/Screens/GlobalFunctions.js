import {firestore, firestoreLite, getstorage} from "./Components/Firebase";
import {collection, getDocs} from "firebase/firestore/lite";
import {Alert, Vibration} from "react-native";
import React from "react";
import CryptoDataService from '../../Services/CryptoDataService';
import _ from "lodash"

export const updateCurrencyPrice = async (data) => {
    let price = 0;
    try {
        const response = await CryptoDataService.getMarketData();
        const filteredData = response.data.filter((item) => item.image === data.currency)
        if (!_.isEmpty(filteredData)) price = (filteredData[0].current_price)
    } catch (error) {
        console.log(error.message);
    }
    const postRef = firestore.collection('AllPosts').doc(data.title);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.hasOwnProperty('USD') && price !== 0) postRef.update({ USD:(price * data.price).toFixed(2).toString()});
            else {
                if (price !== 0) {
                    postRef.set({ USD:(price * data.price).toFixed(2).toString() }, { merge: true });
                }
            }
        }
    });
}

export const ConvertPrice = async (fromUrl, amountFrom, toUrl) =>{
    let FromPrice = 0
    let ToPrice = 0;
    try {
        const response = await CryptoDataService.getMarketData();
        const filteredData = response.data.filter((item) => item.image === fromUrl)
        if (!_.isEmpty(filteredData)) FromPrice = (filteredData[0].current_price) * amountFrom
    } catch (error) {
        console.log(error.message);
    }

    try {
        const response = await CryptoDataService.getMarketData();
        const filteredData = response.data.filter((item) => item.image === toUrl)
        if (!_.isEmpty(filteredData)) ToPrice = (filteredData[0].current_price) * amountFrom
    } catch (error) {
        console.log(error.message);
    }

    return FromPrice/ToPrice;

}

export const generateRating = async (username, setRating, setNumOfReviews) => {
    let sum = 0;
    let counter = 0
    const MyReviewsQuery =  firestore.collection('Reviews').where("Reviewe", "==", username)
    await MyReviewsQuery.get().then(postSnapshot => {
        postSnapshot.forEach(doc => {
            sum = sum + doc.data().stars
            counter++;
        });
    })
    const rating = sum/counter
    const numOfReviews = counter
    setRating(rating)
    setNumOfReviews(numOfReviews)
}

export const readDatabase = async (collectionName, setMasterData, setFilterData) => {
    let results = [];
    try {
        const postCollection = collection(firestoreLite, collectionName);
        const postSnapshot = await getDocs(postCollection);
        // Iterate through each document and push the data to the results array
        postSnapshot.forEach(doc => {
            results.push(doc.data())
        });
    
        // Sort the results by date in descending order
        if (results) {
            results = results.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        }
        setMasterData(results)
        setFilterData(results)
    } catch(error) {
        Alert.alert(error)
    }
}


export const isLiked = (likes, username) =>{
    return likes.includes(username);
}
export const handleLike = async (doc, username, Liked,setLiked) => {
    const PostRef = firestore.collection('AllPosts').doc(doc);
    PostRef.get()
        .then((doc) => {
            if (doc.exists && !doc.data().likes.includes(username)) {
                const likesArray = doc.data().likes || [];
                // Modify the array as needed
                likesArray.push(username);
                // Write the updated array back to the document
                PostRef.update({ likes: likesArray })
                    .then(() => {
                    })
                    .catch((error) => {
                        console.error('Error adding Like:', error);
                    });
            } else {
                const likesArray = doc.data().likes || [];
                const updatedLikesArray = likesArray.filter((username) => username !== username);
                PostRef.update({ likes: updatedLikesArray })
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
    setLiked(!Liked)
    Vibration.vibrate(100)
};

const generatePriceHomes = async (bedrooms, bathrooms) => {
    let price = 0;
    let counter = 0

    const similarPostsQuery = firestore.collection('AllPosts').where("sold", "==", "true").where("bedrooms", "==", bedrooms).where("bathrooms", "==", bathrooms)

    await similarPostsQuery.get().then(postSnapshot => {
        postSnapshot.forEach(doc => {
            price = price + doc.data().price
            counter++;
        });

    })
    return price/counter
}

export const getCityState = async (lat, lng, setState, setCity) => {
    try {
        const response = await fetch(`http://192.168.255.115:5000/api/findCityState/?lat=${lat}&lng=${lng}`);
        const JSONresponse = await response.json();
        setState(JSONresponse.state)
        setCity(JSONresponse.city)
    } catch (error) {
        console.log("server offline");
        return {city:"", state:""}
    }
};


export const categoryFilter = (text, masterData, setFilterData, setCategorySearch) => {
    if (text && text !== 'All') {
        const newData = masterData.filter((item) => {
            const itemData = item.category ? item.category : ''
            return itemData.indexOf(text)>-1;
        });
        setFilterData(newData);
        setCategorySearch(text);
    } else {
        setFilterData(masterData);
        setCategorySearch(text);
    }
}

export const getSoldItems = (UsersPosts) => {
    let counter = 0
    for (let i = 0; i < UsersPosts.length; i++) {
        if (UsersPosts[i].sold === 'true') counter++
    }
    return counter
}

export const getProfilePicture = async (username) => {
    try {
        const userRef = firestore.collection('ProfilePictures').doc(username);
        const doc = await userRef.get();
        if (doc.exists) {
            const profilePicture = doc.data().url;
            return profilePicture;
        } else {
            return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }
    } catch (error) {
        return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }
};

export const AddProfilePicture = async (username, profilePictureUrl) => {
    try {
        const response = await fetch(profilePictureUrl);
        const blob = await response.blob();
        const storageRef = getstorage.ref().child(`ProfilePictures/${username}`);
        await storageRef.put(blob);
        const url = await storageRef.getDownloadURL();

        const profilePicturesRef = firestore.collection('ProfilePictures');

        // Create a new document in the collection with the user ID as the document ID
        await profilePicturesRef.doc(username).set({
            url: url
        });

        const PostsRef = firestore.collection('AllPosts');

        const querySnapshot = await PostsRef.where('profilePic', '==', username).get();

        if (querySnapshot.empty) {
            const batch = firestore.batch();
            querySnapshot.forEach((doc) => {
                const docRef = PostsRef.doc(doc.id);
                batch.update(docRef, { profilePic: url });
            });

            // Commit the batch update
            await batch.commit();
            console.log('Profile picture field updated successfully');
        }

        console.log('Profile picture added successfully');
    } catch (error) {
        console.log('Error adding profile picture:', error);
    }
};
