import { View, Text, FlatList, Image, Pressable } from 'react-native';
import React from "react";
import {firestore} from "./Components/Firebase";
import ReviewCard from "./Components/ReviewCard";
import Ionicons from "react-native-vector-icons/Ionicons";

/*
    @route.params = {DatePosted:TimeStamp, Title: Title of the review, stars: (number of stars), Reviewe:user getting the review, Reviewer:user giving the review, Replies: [{datePosted, message, username (posted by username)}], ReviewMessage:string, id: string (Id of document)}
*/


export default function Reviews({route, navigation}){
    const [ReviewList, setReviewList] = React.useState([])
    const getReviews = async () =>{
        let results = []
        const MyReviewsQuery =  firestore.collection('Reviews').where("Reviewe", "==", route.params.username)
        await MyReviewsQuery.get().then(postSnapshot =>{
            postSnapshot.forEach(doc => {
                results.push({id: doc.id, ...doc.data()});
            });
        })
        if (results){
            results = results.sort((a, b) => {
                return new Date(b.DatePosted) - new Date(a.DatePosted);
            });
        }
        return results;
    }

    React.useEffect(()=>{
        getReviews().then((result)=>{
            setReviewList(result)
        })
    },[])

    return(
        <View style={{flex:1}}>

            <FlatList data={ReviewList}
                      ListHeaderComponent ={
                          <View>
                              <View style={{flexDirection:'row'}}>
                                  <View style={{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:20, marginTop:20}}>
                                      <Pressable onPress={()=>navigation.goBack()}>
                                          <Ionicons name='arrow-back-outline' size={30}/>
                                      </Pressable>
                                  </View>
                              </View>

                          </View>
                      }
                      renderItem={({item})=>(
                          <ReviewCard data ={item} currentUser={route.params.currentUser}/>
                      )}/>

            <View style={{
                position: 'absolute',
                bottom:16,
                right: 16,
            }}>

                <Pressable style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 6,
                }} onPress={() => navigation.navigate("Write Review", {username:route.params.currentUser, PostedBy:route.params.username})}>
                    <Ionicons name="pencil" size={24} color="white" />
                </Pressable>

            </View>

        </View>
    )

}