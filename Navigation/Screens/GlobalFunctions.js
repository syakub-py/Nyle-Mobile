import {firestore, firestoreLite} from "./Components/Firebase";
import {collection, getDocs} from "firebase/firestore/lite";

const generateRating = async (username) => {
    let sum = 0;
    let counter = 0
    const MyReviewsQuery =  firestore.collection('Reviews').where("Reviewe", "== ", username)
    await MyReviewsQuery.get().then(postSnapshot => {
        postSnapshot.forEach(doc => {
            sum = sum + doc.data().stars
            counter++;
        });
    })
    return {rating:sum/counter, numOfReviews:counter}
}

const getPosts = async () => {
    let results =[];
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
    return results;
}

const handleLike = async (doc, username) => {
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
                        console.log('Liked!');
                    })
                    .catch((error) => {
                        console.error('Error adding Like:', error);
                    });
            } else {
                const likesArray = doc.data().likes || [];
                const updatedLikesArray = likesArray.filter((username) => username !== username);
                PostRef.update({ likes: updatedLikesArray })
                    .then(() => {
                        console.log('Like removed');
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

const generatePriceHomes =async (bedrooms, bathrooms) => {
    let price = 0;
    let counter = 0

    const similarPostsQuery =  firestore.collection('AllPosts').where("sold", "== ", "true").where("bedrooms", "== ", bedrooms).where("bathrooms", "== ", bathrooms)

    await similarPostsQuery.get().then(postSnapshot => {
        postSnapshot.forEach(doc => {
            price = price + doc.data().price
            counter++;
        });

    })
    return price/counter
}

const getCityState = async (lat, lng) => {
    try {
        const response = await fetch(`http://192.168.255.115:5000/api/findCityState/?lat=${lat}&lng=${lng}`);
        return await response.json();
    } catch (error) {
        console.log("server offline");
        return {city:"", state:""}
    }
};


// const generatePriceAuto = () => {
//
// }


export {generateRating, getPosts, handleLike, getCityState}
