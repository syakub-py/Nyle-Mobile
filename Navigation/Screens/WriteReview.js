import {View, Text, Pressable, TextInput} from 'react-native';
import {firestore} from "./Components/Firebase";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

/*
    @route.params = {postedBy:user the review was posted by, username:current username}
*/

export default function WriteReview({route, navigation}) {
    const [ReviewMessage, setReviewMessage] = useState("")
    const [Title, setTitle] = useState("")
    const [Stars, setStars] = useState(0)

    const PostReview = () => {
        return firestore.collection("Reviews").add({
            Reviewer: route.params.username,
            Reviewe: route.params.PostedBy,
            Title: Title,
            ReviewMessage :ReviewMessage,
            stars:Stars+1,
            Replies :[],
            DatePosted: new Date().toLocaleString(),
        }).then(ref => {
                navigation.goBack()
        }).catch(error => {
            console.log('Error adding document: ', error);
        });
    }

    return (
        <View style = {{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style = {{ position: 'absolute', top: 30, left: 10 }}>
                <Pressable onPress = {() => navigation.goBack()}>
                    <Ionicons name ='arrow-back-outline' size = {35} />
                </Pressable>
            </View>
            <View style = {{ paddingTop: 70, paddingHorizontal: 10, margin: 10 }}>
                <TextInput style = {{ height: 40, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 }} placeholder = "Title" onChangeText = {(text) => setTitle(text)} />
                <View style = {{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                    {Array.from({ length: 5 }, (_, index) => (
                        <Pressable key = {index} onPress = {() => setStars(index)}>
                            <Ionicons
                                name = {index <= Stars ? 'star' : 'star-outline'}
                                style = {{ fontSize: 20, marginRight: 5, color: index <= Stars ? '#ebd61e' : 'black' }}
                            />
                        </Pressable>
                    ))}
                </View>
                <TextInput style = {{ height: 80, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 10, textAlignVertical: 'top' }} placeholder = "Review Message" onChangeText = {(text) => setReviewMessage(text)} multiline />
                <Pressable style = {{ width: 110, backgroundColor: 'black', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, marginTop: 10 }} onPress = {() => PostReview()}>
                    <Text style = {{ color: 'white', fontSize: 16 }}>Post Review</Text>
                </Pressable>
            </View>
        </View>
    )
}
