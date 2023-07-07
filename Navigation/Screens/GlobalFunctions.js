import {firestore, firestoreLite} from "./Components/Firebase";
import {collection, getDocs} from "firebase/firestore/lite";
import {Alert, Image, View} from "react-native";
import React from "react";

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

export const getPosts = async (setMasterData, setFilterData) => {
    let results = [];
    try {
        const postCollection = collection(firestoreLite, "AllPosts");
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

export const handleLike = async (doc, username) => {
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
            console.log('User document not found');
            return null;
        }
    } catch (error) {
        console.log('Error retrieving profile picture:', error);
        return null;
    }
};


export const AddProfilePicture = async (userId, profilePictureUrl) => {
    try {
        const profilePicturesRef = firestore.collection('ProfilePictures');

        // Create a new document in the collection with the user ID as the document ID
        await profilePicturesRef.doc(userId).set({
            profilePicture: profilePictureUrl
        });

        console.log('Profile picture added successfully');
    } catch (error) {
        console.log('Error adding profile picture:', error);
    }
};
