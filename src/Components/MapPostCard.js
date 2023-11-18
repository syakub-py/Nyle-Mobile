import React, {useState, useEffect, useContext} from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import {isLiked} from '../Screens/GlobalFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RenderIsLiked from './PostDetailsComponents/renderIsLiked';
import {UserContext} from '../Contexts/Context';
import usePostContext from '../Services/UsePostContext';

export default function MapPostCard({title}) {
  const [rating, setRating] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const postContext = usePostContext(title);
  const userContext =useContext(UserContext);
  const [Liked, setLiked] = useState(isLiked(postContext.likes, userContext.username));

  useEffect(() => {
    generateRating(postContext.postedBy, setRating, setNumOfReviews);
  }, []);


  const RenderLikeButton = () =>{
    if (userContext.username !== postContext.postedBy) {
      return (
        <View style = {{position: 'absolute', right: 7, top: 7, height: 30, width: 30, borderRadius: 12, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable onPress = {() =>handleLike(postContext.title, userContext.username, Liked, setLiked)}>
            <RenderIsLiked Liked={Liked} size={20}/>
          </Pressable>
        </View>
      );
    }
    return null;
  };

  return (
    <ImageBackground source = {{uri: postContext.pictures[0]}} imageStyle = {{resizeMode: 'cover', borderRadius: 10}} style = {{flex: 1}}>
      <RenderLikeButton/>
      <View style = {{flexDirection: 'row', backgroundColor: 'white', alignSelf: 'center', justifyContent: 'space-between', position: 'absolute', bottom: 10, borderRadius: 10, padding: 5, width: 215}}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style = {{fontSize: 14, fontWeight: '500', alignSelf: 'center'}}>{postContext.title}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name = "star" style = {{marginRight: 2}} color = "#ebd61e" size = {13} />
            <Text style={{fontSize: 12, fontWeight: 'bold'}}>{rating.toFixed(1)}</Text>
            <Text style={{fontSize: 10, color: 'grey', marginLeft: 3}}>({numOfReviews} reviews)</Text>
          </View>
        </View>
        <Text style={{fontSize: 11, justifyContent: 'center', alignSelf: 'center', color: 'grey'}}>${Number(postContext.USD).toLocaleString('en-US')}</Text>

        <View style={{height: 40, width: 40, backgroundColor: 'black', borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Ionicons name={'chevron-forward-outline'} size={25} color={'white'}/>
        </View>

      </View>
    </ImageBackground>
  );
}
