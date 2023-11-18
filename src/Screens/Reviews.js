import {View, Text, FlatList, SafeAreaView, Pressable} from 'react-native';
import React, {useContext} from 'react';
import ReviewCard from '../Components/ReviewCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from '../Components/BackButton';
import {UserContext} from '../Contexts/Context';
import {useNavigation} from '@react-navigation/native';

/*
    @route.params = {DatePosted:TimeStamp, Title: Title of the review, stars: (number of stars), Reviewe: user getting the review, Reviewer:user giving the review, Replies: [{datePosted, message, username (posted by username)}], ReviewMessage:string, id: string (Id of document)}
*/

export default function Reviews({route}) {
  const PostedByUsername = route.params.username;
  const userContext = useContext(UserContext);
  const ReviewList = userContext.reviews;
  const navigation = useNavigation();
  const RenderIsCurrentUser = () => {
    if (userContext.username === PostedByUsername) return <View/>;
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

      <FlatList data = {ReviewList}
        ListHeaderComponent = {
          <View style = {{flex: 1, flexDirection: 'row', marginTop: 35, alignItems: 'center'}}>

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
        }
        renderItem = {({item}) => (
          <ReviewCard data = {item}/>
        )}/>
      <RenderIsCurrentUser/>

    </SafeAreaView>
  );
}
