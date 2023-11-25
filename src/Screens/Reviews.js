import {View, Text, FlatList, SafeAreaView, Pressable} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import ReviewCard from '../Components/ReviewCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from '../Components/BackButton';
import {UserContext} from '../Contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import {LoadingAnimation} from '../Components/LoadingAnimation';

/*
    @route.params = {DatePosted:TimeStamp, Title: Title of the review, stars: (number of stars), Reviewe: user getting the review, Reviewer:user giving the review, Replies: [{datePosted, message, username (posted by username)}], ReviewMessage:string, id: string (Id of document)}
*/

export default function Reviews({route}) {
  const PostedByUsername = route.params.username;
  const userContext = useContext(UserContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setLoading(true);
    userContext.getReviews().then(()=>{
      setLoading(false);
    });
  }, []);

  const RenderIsCurrentUser = () => {
    if (userContext.username === PostedByUsername) return null;
    return (
      <View style = {{
        position: 'absolute',
        bottom: 16,
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
        }} onPress = {() => navigation.navigate('Write Review', {PostedBy: PostedByUsername})}>
          <Ionicons name = "pencil" size = {24} color = "white" />
        </Pressable>

      </View>
    );
  };

  return (
    <SafeAreaView style = {{flex: 1, backgroundColor: 'whitesmoke'}}>

      <FlatList data = {userContext.reviews}
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
      <RenderIsCurrentUser/>

    </SafeAreaView>
  );
}
