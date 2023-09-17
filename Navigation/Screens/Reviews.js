import { View, Text, FlatList, SafeAreaView, Pressable } from 'react-native';
import React, {useState, useEffect} from "react";
import {firestore} from "./Components/Firebase";
import ReviewCard from "./Components/ReviewCard";
import Ionicons from "react-native-vector-icons/Ionicons";

/*
    @route.params = {DatePosted:TimeStamp, Title: Title of the review, stars: (number of stars), Reviewe: user getting the review, Reviewer:user giving the review, Replies: [{datePosted, message, username (posted by username)}], ReviewMessage:string, id: string (Id of document)}
*/

const getReviews = async (username) => {
    let results = []
    const MyReviewsQuery =  firestore.collection('Reviews').where("Reviewe", "==", username)
    await MyReviewsQuery.get().then(postSnapshot => {
        postSnapshot.forEach(doc => {
            results.push({id: doc.id, ...doc.data()});
        });
    })
    if (results) {
        results = results.sort((a, b) => {
            return new Date(b.DatePosted) - new Date(a.DatePosted);
        });
    }
    return results;
}

export default function Reviews({route, navigation}) {
    const [ReviewList, setReviewList] = useState([])
    const PostedByUsername = route.params.username
    const currentUsername = route.params.currentUser
    useEffect(() => {
        getReviews(PostedByUsername).then((result) => {
            setReviewList(result)
        })
    }, [])

    const renderIsCurrentUser = () => {
        if (currentUsername === PostedByUsername) return <View/>
        
        return (
            <View style = {{
                position: 'absolute',
                bottom:16,
                right: 16,
            }}>
                <Pressable style = {{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 6,
                }} onPress = {() => navigation.navigate("Write Review", {username:currentUsername, PostedBy:PostedByUsername})}>
                    <Ionicons name = "pencil" size = {24} color = "white" />
                </Pressable>

            </View>
        )
    }

    return (
        <SafeAreaView style = {{flex:1, backgroundColor:'whitesmoke'}}>

            <FlatList data = {ReviewList}
                ListHeaderComponent = {
                    <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style = {{ position: 'absolute', top: 20, left: 0, zIndex: 1 }}>
                            <Pressable onPress = {() => navigation.goBack()} style = {{ padding: 10 }}>
                                <Ionicons name ='arrow-back-outline' size = {30} />
                            </Pressable>
                        </View>
                        <View >
                            <View style = {{ height: 50, width: 90, backgroundColor: 'transparent', marginTop: 20 }}>
                                <Text style = {{ fontSize: 18, fontWeight: 'bold' }}>Reviews</Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem = {({item}) => (
                    <ReviewCard data = {item} currentUser = {currentUsername}/>
            )}/>
            {renderIsCurrentUser()}

        </SafeAreaView>
    )
}
