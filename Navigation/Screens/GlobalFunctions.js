import {firestore} from "./Components/Firebase";
import React from "react";

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


export {generateRating}