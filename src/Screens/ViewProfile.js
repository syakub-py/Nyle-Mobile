import {View, Text, SafeAreaView, FlatList, Image} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import PostCard from '../Components/PostCard';
import {firestore} from '../Firebase/Firebase';
import BackButton from '../Components/BackButton';
import RatingButton from '../Components/RatingButton';
import {UserContext} from '../Contexts/UserContext';
import {AppContext} from '../Contexts/NyleContext';

/*
    @route.params = {ProfileImage: profile picture of current user, currentUsername: the current username, postedByUsername:the user that the posts were posted by}
*/

const getPosts = async (username, setUserPosts) => {
  const results = [];
  const MyPostsQuery = firestore.collection('AllPosts').where('postedBy', '==', username);
  await MyPostsQuery.get().then((postSnapshot) => {
    postSnapshot.forEach((doc) => {
      results.push(doc.data());
    });
  });
  setUserPosts(results);
};

export default function ViewProfile({route}) {
  const [UsersPosts, setUserPosts] = useState([]);
  const [rating, setRating] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const postedByUsername = route.params.postedByUsername;
  const userContext = useContext(UserContext);
  const nyleContext = useContext(AppContext);
  useEffect(() => {
    getPosts(postedByUsername, setUserPosts);
    nyleContext.getProfileOtherPicture(postedByUsername, setRating, setNumOfReviews);
  }, []);

  return (
    <SafeAreaView>
      <View>
        <FlatList
          ListHeaderComponent = {
            <View>
              <View style = {{height: 50, width: 50, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 20, marginTop: 20}}>
                <BackButton />
              </View>

              <View style = {{alignItems: 'center', paddingTop: 10}}>
                <Image resizeMode ='cover' source = {{uri: userContext.profilePicture}} style = {{height: 150, width: 150, borderRadius: 100}}/>
                <View>
                  <Text style = {{fontSize: 22, fontWeight: '700', paddingTop: 10}}>{postedByUsername}</Text>
                </View>
              </View>

              <View style = {{flexDirection: 'row', alignSelf: 'center', paddingTop: 10}}>
                <View style={{flexDirection: 'column', alignContent: 'center'}}>
                  <RatingButton username={postedByUsername} rating ={rating}/>
                  <Text style={{fontSize: 13, color: 'gray'}}>({numOfReviews} reviews)</Text>
                </View>

                <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%', marginLeft: 10, marginRight: 10}} />

                <View style = {{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style = {{fontSize: 20, fontWeight: '500'}}>{UsersPosts.length}</Text>
                  <Text style = {{fontSize: 15, fontWeight: '400', color: 'lightgray'}}>Total Items</Text>
                </View>
              </View>

              <Text style = {{margin: 20, fontSize: 20, fontWeight: '500'}}>Posts</Text>

            </View>
          }
          data = {UsersPosts}
          renderItem = {({item}) => (
            <PostCard postId = {item.id}/>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
