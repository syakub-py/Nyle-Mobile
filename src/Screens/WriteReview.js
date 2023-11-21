import {View, Text, Pressable, TextInput} from 'react-native';
import {firestore} from '../Components/Firebase';
import React, {useContext, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from '../Components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../Contexts/UserContext';

/*
    @route.params = {postedBy:user the review was posted by}
*/

export default function WriteReview({route}) {
  const [reviewMessage, setReviewMessage] = useState('');
  const [title, setTitle] = useState('');
  const [stars, setStars] = useState(0);
  const navigation =useNavigation();
  const userContext = useContext(UserContext);

  const postReview = () => {
    return firestore.collection('Reviews').add({
      Reviewer: userContext.username,
      Reviewe: route.params.postedBy,
      Title: title,
      ReviewMessage: reviewMessage,
      stars: stars+1,
      Replies: [],
      DatePosted: new Date().toLocaleString(),
    }).then(() => {
      navigation.goBack();
    }).catch((error) => {
      console.log('Error adding document: ', error);
    });
  };

  return (
    <View style = {{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style = {{position: 'absolute', top: 30, left: 10}}>
        <BackButton />
      </View>
      <View style = {{paddingTop: 70, paddingHorizontal: 10, margin: 10}}>
        <TextInput style = {{height: 40, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10}} placeholder = "Title" onChangeText = {(text) => setTitle(text)} />
        <View style = {{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
          {Array.from({length: 5}, (_, index) => (
            <Pressable key = {index} onPress = {() => setStars(index)}>
              <Ionicons
                name = {index <= stars ? 'star' : 'star-outline'}
                style = {{fontSize: 20, marginRight: 5, color: index <= stars ? '#ebd61e' : 'black'}}
              />
            </Pressable>
          ))}
        </View>
        <TextInput style = {{height: 80, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 10, textAlignVertical: 'top'}} placeholder = "Review Message" onChangeText = {(text) => setReviewMessage(text)} multiline />
        <Pressable style = {{
          width: 110,
          backgroundColor: 'black',
          borderRadius: 10, paddingVertical: 5,
          paddingHorizontal: 10,
          marginTop: 10,
        }}
        onPress = {() => postReview()}>
          <Text style = {{color: 'white', fontSize: 16}}>Post Review</Text>
        </Pressable>
      </View>
    </View>
  );
}
