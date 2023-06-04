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

export {generateRating}