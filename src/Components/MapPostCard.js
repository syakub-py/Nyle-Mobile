import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import {generateRating, handleLike, isLiked} from '../Screens/GlobalFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RenderIsLiked from './PostDetailsComponents/renderIsLiked';

export default function MapPostCard({data, username}) {
  const [rating, setRating] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const [Liked, setLiked] = useState(isLiked(data.likes, username));
  useEffect(() => {
    generateRating(data.PostedBy, setRating, setNumOfReviews);
  }, []);


  return (
    <ImageBackground source = {{uri: data.pic[0]}} imageStyle = {{resizeMode: 'cover', borderRadius: 10}} style = {{flex: 1}}>
      <View style = {{position: 'absolute', right: 7, top: 7, height: 30, width: 30, borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
        <Pressable onPress = {() =>handleLike(data.title, username, Liked, setLiked)}>
          <RenderIsLiked Liked={Liked} size={20}/>
        </Pressable>
      </View>

      <View style = {{flexDirection: 'row', backgroundColor: 'white', alignSelf: 'center', justifyContent: 'space-between', position: 'absolute', bottom: 10, borderRadius: 10, padding: 5, width: 215}}>
        <View>
          <Text style = {{fontSize: 14, fontWeight: '500', alignSelf: 'center'}}>{data.title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name = "star" style = {{marginRight: 2}} color = "#ebd61e" size = {13} />
            <Text style={{fontSize: 12, fontWeight: 'bold'}}>{rating.toFixed(1)}</Text>
            <Text style={{fontSize: 10, color: 'grey', marginLeft: 3}}>({numOfReviews} reviews)</Text>
          </View>
        </View>

        <View style={{height: 40, width: 40, backgroundColor: 'black', borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Ionicons name={'chevron-forward-outline'} size={25} color={'white'}/>
        </View>

      </View>
    </ImageBackground>
  );
}
