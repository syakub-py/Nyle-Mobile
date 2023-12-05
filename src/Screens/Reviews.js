import {View, Text, FlatList, SafeAreaView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import ReviewCard from '../Components/ReviewCard';
import BackButton from '../Components/BackButton';
import {UserContext} from '../Contexts/UserContext';
import {LoadingAnimation} from '../Components/LoadingAnimation';
import {AppContext} from '../Contexts/NyleContext';
import RenderWriteReviewButton from '../Components/ReviewComponents/RenderWriteReviewButton';

/*
    @route.params = {DatePosted:TimeStamp, Title: Title of the review, stars: (number of stars), Reviewe: user getting the review, Reviewer:user giving the review, Replies: [{datePosted, message, username (posted by username)}], ReviewMessage:string, id: string (Id of document)}
*/

export default function Reviews({route}) {
  const PostedByUsername = route.params.username;
  const userContext = useContext(UserContext);
  const nyleContext =useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [postedByReviews, setPostedByReviews] = useState([]);
  useEffect(()=>{
    setLoading(true);
    userContext.getReviews().then(()=>{
      setLoading(false);
    });
    setLoading(true);
    nyleContext.getOtherReviews(PostedByUsername).then((results)=>{
      setPostedByReviews(results);
      setLoading(false);
    });
  }, []);

  const ReviewList = ({reviews}) =>{
    return (
      <View style = {{flex: 1, backgroundColor: 'whitesmoke'}}>
        <FlatList data = {reviews}
          ListHeaderComponent = {
            <View style={{flex: 1}}>
              <LoadingAnimation loading={loading}/>
              <View style = {{flexDirection: 'row', marginTop: 35, alignItems: 'center'}}>
                <View style = {{zIndex: 1}}>
                  <BackButton />
                </View>

                <View style={{flexDirection: 'column'}}>
                  <View style = {{width: 90, backgroundColor: 'transparent'}}>
                    <Text style = {{fontSize: 18, fontWeight: 'bold'}}>Reviews</Text>
                  </View>
                  <Text style={{color: 'lightgray', fontSize: 13}}>{PostedByUsername}</Text>
                </View>
              </View>
            </View>

          }
          renderItem = {({item}) => (
            <ReviewCard data = {item}/>
          )}/>
        <RenderWriteReviewButton username={userContext.username} PostedByUsername={PostedByUsername}/>
      </View>
    );
  };

  if (PostedByUsername!== userContext.username) {
    return (
      <ReviewList reviews={postedByReviews}/>
    );
  }
  return (
    <ReviewList reviews={userContext.reviews}/>
  );
}
