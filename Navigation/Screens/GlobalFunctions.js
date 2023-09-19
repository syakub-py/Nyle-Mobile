import {firestore, getstorage} from "./Components/Firebase";
import {Vibration} from "react-native";
import CryptoDataService from '../../Services/CryptoDataService';
import _ from "lodash"

export const updateCurrencyPrice = async (data) => {
    let price = 0;
    try {
        const response = await CryptoDataService.getMarketData();
        const filteredData = response.data.filter((item) => item.image === data.currency[0].value)
        if (!_.isEmpty(filteredData)) price = (filteredData[0].current_price)
    } catch (error) {
        console.log(error.message);
    }
    const postRef = firestore.collection('AllPosts').doc(data.title);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.hasOwnProperty('USD') && price !== 0) postRef.update({ USD:(price * data.currency[0].price).toFixed(2).toString()});
            else {
                postRef.set({ USD:(price * data.currency[0].price).toFixed(2).toString() }, { merge: true });
            }
        }
    });
}

export const convertPrice = async (fromSymbol, amountFrom, toSymbol) =>{
    try {
        return (await fetch(`http://192.168.234.115:5000/api/convertPrice/?from=${fromSymbol.toUpperCase()}&amount=${amountFrom.toUpperCase()}&to=${toSymbol.toUpperCase()}`)).json()
    } catch (error) {
        console.log("server offline");
        return 0
    }
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
    if (!_.isNil(setNumOfReviews)){
        setNumOfReviews(numOfReviews)
    }
}

export const readDatabase = async (
    collectionName,
    setMasterData,
    setFilterData,
    setLastDocument
) => {
    try {
        const postRef = firestore.collection(collectionName);

        // Fetch the initial two documents
        const querySnapshot = await postRef.limit(2).get();

        let results = querySnapshot.docs.map((doc) => doc.data());

        // Sort the results by date in descending order
        results = results.sort((a, b) => new Date(b.date) - new Date(a.date));

        setMasterData(results);
        setFilterData(results);

        if (querySnapshot.docs.length > 0) {
            const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastDocument(lastDocument);
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleEndReached = async (
    currentData,
    lastDocument,
    setFilterData,
    setMasterData,
    setLastDocument,
    setLoading) => {

    setLoading(true)
    const postRef = firestore.collection("AllPosts");
    // Retrieve the next two elements using startAfter
    let querySnapshot = null;
    if (lastDocument) {
        querySnapshot = await postRef
            .startAfter(lastDocument)
            .limit(2)
            .get();
    } else {
        querySnapshot = await postRef.limit(2).get();
    }

    // Combine the initial set and the next two elements
    let results = querySnapshot.docs.map((doc) => doc.data());
    currentData = currentData.concat(results);
    setFilterData(currentData);
    setMasterData(currentData);

    if (querySnapshot.docs.length > 0) {
        const newLastDocument =
            querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDocument(newLastDocument);
    }
    setLoading(false)
};


export const updatedCurrencyList = (currencyList) =>{
    if(_.size(currencyList)>1){
        return currencyList
    }else{
        return currencyList
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


export const categoryFilter = (text, masterData, setFilterData) => {
    if (text && text !== 'All') {
        const newData = masterData.filter((item) => {
            const itemData = item.category ? item.category : ''
            return itemData.indexOf(text)>-1;
        });
        setFilterData(newData);
    } else {
        setFilterData(masterData);
    }
}

export const postFilter = (text, masterData, setFilterData) => {
    if (text && text !== 'Latest Posts') {
        switch (text) {
            case 'Most Expensive':
                const newDataMostExpensive = masterData.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
                setFilterData(newDataMostExpensive);
                break;
            case 'Trending':
                const newDataTrending = masterData.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
                setFilterData(newDataTrending);
                break;
            case 'Cheapest':
                const newDataCheapest = masterData.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
                setFilterData(newDataCheapest);
                break;
            case 'Top Rated Sellers':
                const TopRatedMySellers = masterData.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
                setFilterData(TopRatedMySellers);
                break;
            default:
                setFilterData(masterData);
                break;
        }
    } else {
        setFilterData(masterData);
    }
};

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
            return doc.data().url;
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
