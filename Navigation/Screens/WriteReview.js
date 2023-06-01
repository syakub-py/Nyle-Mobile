import {View, Text, FlatList, Image, Pressable, Alert, TextInput} from 'react-native';
import {firestore} from "./Components/Firebase";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function WriteReview({route, navigation}) {
    const [ReviewMessage, setReviewMessage] = React.useState("")
    const [Title, setTitle] = React.useState("")
    const [Stars, setStars] = React.useState(0)

    const PostReview = () =>{
        return firestore.collection("Reviews").add({
            Reviewer: route.params.username,
            Reviewe: route.params.PostedBy,
            Title: Title,
            ReviewMessage :ReviewMessage,
            stars:Stars+1,
            Replies :[],
            DatePosted: new Date().toLocaleString(),
        }).then(ref => {
                console.log('Added document with ID: ' + ref.id);
                navigation.goBack()
        }).catch(error => {
            console.log('Error adding document: ', error);
        });
    }

    return(
        <View style={{flex:1}}>
            <View style={{ position:'absolute', right:10, top:20}}>
                <Pressable onPress={()=>navigation.goBack()}>
                    <Ionicons name='close-outline' size={35}/>
                </Pressable>
            </View>
            <View style={{paddingTop:40, margin:10}}>

                <TextInput style={{height:40}} placeholder={"Title"} onChangeText={(text)=>setTitle(text)}/>
                <View style={{flexDirection:"row", marginTop:10, marginBottom:10}}>
                    {
                        Array.from({ length: 5 }, (_, index) => (
                            <Pressable key={index} onPress={() => setStars(index)}>
                                <Ionicons  size={20} name={index <= Stars ? 'star' : 'star-outline'}
                                          color={index <= Stars?"#ebd61e":'black'} />
                            </Pressable>
                        ))
                    }
                </View>
                <TextInput placeholder={"Review Message"} onChangeText={(text)=>setReviewMessage(text)} multiline/>
            </View>

            <Pressable style={{position:'absolute', bottom:10, left:10}} onPress={()=>PostReview()}>
                <View style={{backgroundColor:'black', borderRadius:10}}>
                    <Text style={{color:"white", margin:5}}>Post Review</Text>
                </View>
            </Pressable>

        </View>
    )
}