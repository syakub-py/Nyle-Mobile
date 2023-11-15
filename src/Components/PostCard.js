import {FlatList, Image, ImageBackground, Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {handleLike, updateCurrencyPrice, isLiked, updatedCurrencyList} from '../Screens/GlobalFunctions';

export default function PostCard({data, username, currentProfilePicture}) {
  const navigation = useNavigation();
  const [Liked, setLiked] = useState(isLiked(data.likes, username));
  const [currentIndex, setCurrentIndex] = useState(0);
  const smallFlatListRef = useRef(null);
  const mainFlatListRef = useRef(null);

  useEffect(() => {
    updateCurrencyPrice(data);
  }, [data.currency[0].value]);

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
    if (username === data.PostedBy) return <Image style = {{height: 50, width: 50, borderRadius: 15, marginLeft: 12, marginRight: 12}} source = {{uri: data.profilePic}}/>;
    return (
      <Pressable onPress = {() => navigation.navigate('view profile', {ProfileImage: data.profilePic, postedByUsername: data.PostedBy, currentUsername: username, currentProfilePicture})}>
        <Image style = {{height: 50, width: 50, borderRadius: 15, marginLeft: 12, marginRight: 12}} source = {{uri: data.profilePic}}/>
      </Pressable>
    );
  };

  const change = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    setCurrentIndex(slide);
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
          (username !== data.PostedBy) ? (
              <View style={{position: 'absolute', right: 10, top: 10, backgroundColor: 'white', height: 40, width: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', opacity: 0.7, zIndex: 2}}>
                <Pressable onPress={() => handleLike(data.title, username, Liked, setLiked)}>
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
            <Image style={{height: 20, width: 20, marginTop: 4, borderRadius: 20}} source={{uri: updatedCurrencyList(data.currency)[0].value}}/>
            <Text style={{color: 'white', fontSize: 15, elevation: 1, marginLeft: 5, fontWeight: '500'}}>{updatedCurrencyList(data.currency)[0].price} </Text>
            <Text style={{color: 'white', fontSize: 11, elevation: 1, fontWeight: '500'}}>(${Number(data.USD).toLocaleString('en-US')})</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={data.pic}
        horizontal
        pagingEnabled
        onScroll={change}
        ref = {mainFlatListRef}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'center'}
        renderItem={({item}) => (
          <Pressable onPress={() => navigation.navigate('post details', {CurrentUserProfilePic: currentProfilePicture, username: username, data})}>
            <ImageBackground source={{uri: item}} imageStyle={{borderRadius: 10, resizeMode: 'cover'}} style={{width: 365, height: 300, borderRadius: 10, zIndex: 0}}/>
          </Pressable>
        )}
      />

      <FlatList
        data={data.pic}
        horizontal={true}
        style = {{bottom: 10,
          position: 'absolute',
          width: 150,
          height: 70,
          left: '50%',
          marginLeft: -75,
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
              <Image source = {{uri: item}} style = {{height: 40, width: 40, transform: [{scale: index === currentIndex ? 1.2 : scaleFactor}], borderRadius: 6, borderWidth: index === currentIndex ?2:0, borderColor: index === currentIndex ?'white':'transparent', marginLeft: index === 0 ? 150/2-(40/2) : 3, marginRight: index === data.pic.length - 1 ? 150/2 - (40/2) : 3}} key = {item}/>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
