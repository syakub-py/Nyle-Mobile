import {View, Text, Pressable, TextInput} from 'react-native';
import {firestore} from "../Components/Firebase";
import React, {useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import BackButton from "../Components/BackButton";

const PostReview = (username, PostedBy, Title, ReviewMessage, Stars, navigation) => {
    return firestore.collection("Reviews").add({
        Reviewer: username,
        Reviewe: PostedBy,
        Title: Title,
        ReviewMessage: ReviewMessage,
        stars: Stars+1,
        Replies: [],
        DatePosted: new Date().toLocaleString(),
    }).then(ref => {
        navigation.goBack()
    }).catch(error => {
        console.log('Error adding document: ', error);
    });
}

/*
    @route.params = {postedBy:user the review was posted by, username:current username}
*/

export default function WriteReview({route, navigation}) {
    const [reviewMessage, setReviewMessage] = useState("")
    const [title, setTitle] = useState("")
    const [stars, setStars] = useState(0)

    return (
        <View style = {{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style = {{ position: 'absolute', top: 30, left: 10 }}>
                <BackButton navigation={navigation}/>
            </View>
            <View style = {{ paddingTop: 70, paddingHorizontal: 10, margin: 10 }}>
                <TextInput style = {{ height: 40, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 }} placeholder = "Title" onChangeText = {(text) => setTitle(text)} />
                <View style = {{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                    {Array.from({ length: 5 }, (_, index) => (
                        <Pressable key = {index} onPress = {() => setStars(index)}>
                            <Ionicons
                                name = {index <= stars ? 'star' : 'star-outline'}
                                style = {{ fontSize: 20, marginRight: 5, color: index <= stars ? '#ebd61e' : 'black' }}
                            />
                        </Pressable>
                    ))}
                </View>
                <TextInput style = {{ height: 80, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 10, textAlignVertical: 'top' }} placeholder = "Review Message" onChangeText = {(text) => setReviewMessage(text)} multiline />
                <Pressable style = {{ width: 110, backgroundColor: 'black', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, marginTop: 10 }} onPress = {() => PostReview(route.params.username, route.params.PostedBy, title, reviewMessage, stars, navigation)}>
                    <Text style = {{ color: 'white', fontSize: 16 }}>Post Review</Text>
                </Pressable>
            </View>
        </View>
    )
}
