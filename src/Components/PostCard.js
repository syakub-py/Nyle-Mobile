import {Dimensions, FlatList, Image, ImageBackground, Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import findPost from '../Services/FindPost';
import {UserContext} from '../Contexts/UserContext';
import {Post} from '../Classes/Post';

export default function PostCard({postId}) {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  const data = findPost(postId) || new Post(userContext.deletedPosts.find((item) => item.id === postId));
  const [Liked, setLiked] = useState(data.isLiked(userContext.username));
  const [currentIndex, setCurrentIndex] = useState(0);
  const smallFlatListRef = useRef(null);
  const mainFlatListRef = useRef(null);
  const ITEM_HEIGHT = 300;
  const FLATLIST_WIDTH = 140;
  const FLATLIST_PICTURE_DIMENSIONS = 40;

  useEffect(() => {
    data.updateCurrencyPrice();
  }, [data.currencies[0].value]);

  useEffect(()=>{
    smallFlatListRef.current?.scrollToIndex({
      index: currentIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [currentIndex]);

  const RenderLiked = () => {
    if (Liked) {
      return <Ionicons name='heart' size={25} color={'#e6121d'}/>;
    }
    return <Ionicons name ='heart-outline' size = {25}/>;
  };

  const RenderIsUsernameSameAsPostedBy = () => {
    if (userContext.username === data.postedBy) return <Image style = {{height: 50, width: 50, borderRadius: 15, marginLeft: 12, marginRight: 12}} source = {{uri: userContext.profilePicture}}/>;
    return (
      <Pressable onPress = {() => navigation.navigate('view profile', {postedByUsername: data.postedBy})}>
        <Image style = {{height: 50, width: 50, borderRadius: 15, marginLeft: 12, marginRight: 12}} source = {{uri: data.profilePicture}}/>
      </Pressable>
    );
  };

  const changeIndex = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide>=0) {
      setCurrentIndex(slide);
    }
  };

  const scrollToActiveIndex = (index) =>{
    mainFlatListRef.current.scrollToIndex({
      index: index,
      animated: false,
    });
    setCurrentIndex(index);
  };

  return (
    <View style={{backgroundColor: 'transparent', borderRadius: 10, margin: 10}}>
      {
                (userContext.username !== data.postedBy) ? (
                    <View style={{position: 'absolute', right: 10, top: 10, backgroundColor: 'white', height: 40, width: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', opacity: 0.7, zIndex: 2}}>
                      <Pressable onPress={() => data.handleLikeCounter(userContext.username, setLiked)}>
                        <RenderLiked/>
                      </Pressable>
                    </View>
                ) : null
      }
      <View style={{flexDirection: 'row', position: 'absolute', top: 12, left: 10, zIndex: 1}}>
        <RenderIsUsernameSameAsPostedBy/>
        <View style={{marginLeft: 5}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white', elevation: 1}}>{data.title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{height: 20, width: 20, marginTop: 4, borderRadius: 20}} source={{uri: data.updatedCurrencyList(data.currencies)[0].value}}/>
            <Text style={{color: 'white', fontSize: 15, elevation: 1, marginLeft: 5, fontWeight: '500'}}>{data.updatedCurrencyList(data.currencies)[0].price} </Text>
            <Text style={{color: 'white', fontSize: 11, elevation: 1, fontWeight: '500'}}>(${Number(data.USD).toLocaleString('en-US')})</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={data.pictures}
        horizontal
        pagingEnabled
        onScroll={changeIndex}
        bounces={false}
        ref = {mainFlatListRef}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'center'}
        renderItem={({item}) => (
          <Pressable onPress={() => navigation.navigate('post details', {id: data.id})}>
            <ImageBackground source={{uri: item}} imageStyle={{borderRadius: 10, resizeMode: 'cover'}} style={{width: Dimensions.get('window').width-20, height: ITEM_HEIGHT, borderRadius: 10, zIndex: 0}}/>
          </Pressable>
        )}
      />

      <FlatList
        data={data.pictures}
        horizontal={true}
        style = {{
          bottom: 10,
          position: 'absolute',
          width: 150,
          height: 70,
          left: '50%',
          marginLeft: -70,
        }}
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref = {smallFlatListRef}
        initialScrollIndex={currentIndex}
        snapToAlignment={'center'}
        renderItem={({item, index})=>{
          const distanceFromCenter = Math.abs(currentIndex - index);
          const scaleFactor = 1 - distanceFromCenter * 0.25;
          return (
            <Pressable key = {item} onPress = {() => {
              scrollToActiveIndex(index);
            }}>
              <Image source = {{uri: item}} style = {{height: FLATLIST_PICTURE_DIMENSIONS, width: FLATLIST_PICTURE_DIMENSIONS, transform: [{scale: index === currentIndex ? 1.2 : scaleFactor}], borderRadius: 6, borderWidth: index === currentIndex ?2:0, borderColor: index === currentIndex ?'white':'transparent', marginLeft: index === 0 ? FLATLIST_WIDTH/2-(FLATLIST_PICTURE_DIMENSIONS/2) : 3, marginRight: index === data.pictures.length - 1 ? FLATLIST_WIDTH/2 - (FLATLIST_PICTURE_DIMENSIONS/2) : 3}} key = {item}/>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
