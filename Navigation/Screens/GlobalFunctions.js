import {firestore, firestoreLite} from "./Components/Firebase";
import React from "react";
import {collection, getDocs} from "firebase/firestore/lite";

const generateRating = async (username) =>{
    let sum = 0;
    let counter = 0
    const MyReviewsQuery =  firestore.collection('Reviews').where("Reviewe", "==", username)
    await MyReviewsQuery.get().then(postSnapshot =>{
        postSnapshot.forEach(doc => {
            sum = sum + doc.data().stars
            counter++;
        });
    })
    return sum/counter
}

const getPosts = async ()=>{
    let results =[];
    const postCollection = collection(firestoreLite, "AllPosts");
    const postSnapshot = await getDocs(postCollection);
    // Iterate through each document and push the data to the results array
    postSnapshot.forEach(doc => {
        results.push(doc.data())
    });

    // Sort the results by date in descending order
    if (results){
        results = results.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
    }
    return results;
}

const generatePriceHomes =async (bedrooms, bathrooms) =>{
    let price = 0;
    let counter = 0

    const similarPostsQuery =  firestore.collection('AllPosts').where("sold", "==", "true").where("bedrooms", "==", bedrooms).where("bathrooms", "==", bathrooms)

    await similarPostsQuery.get().then(postSnapshot =>{
        postSnapshot.forEach(doc => {
            price = price + doc.data().price
            counter++;
        });

    })
    return price/counter
}


// const generatePriceAuto = () =>{
//
// }


export {generateRating, getPosts}