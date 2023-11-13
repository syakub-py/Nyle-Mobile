import {Dimensions, FlatList, Image, ImageBackground, Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {handleLike, updateCurrencyPrice, isLiked, updatedCurrencyList} from '../Screens/GlobalFunctions';

const handleScroll = (setIndex, index) =>{
  console.log(index);
  setIndex(index);
};

export default function PostCard({data, username}) {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [Liked, setLiked] = useState(isLiked(data.likes, username));

  useEffect(() => {
    updateCurrencyPrice(data);
  }, [data.currency[0].value]);

  const RenderLiked = () => {
    if (Liked) {
      return <Ionicons name='heart' size={25} color={'#e6121d'}/>;
    }
    return <Ionicons name ='heart-outline' size = {25}/>;
  };

  const RenderIsUsernameSameAsPostedBy = () => {
    if (username === data.PostedBy) return <Image style = {{height: 50, width: 50, borderRadius: 15, margin: 12}} source = {{uri: data.profilePic}}/>;
    return (
      <Pressable onPress = {() => navigation.navigate('view profile', {ProfileImage: data.profilePic, postedByUsername: data.PostedBy, currentUsername: username})}>
        <Image style = {{height: 50, width: 50, borderRadius: 15, margin: 12}} source = {{uri: data.profilePic}}/>
      </Pressable>
    );
  };

  return (
    <View style = {{backgroundColor: 'white', marginBottom: 10, margin: 10, borderRadius: 10, elevation: 3}}>
      <View style = {{width: '100%', height: 300}}>
        <ImageBackground source = {{uri: data.pic[index]}} imageStyle = {{width: '100%', height: 300, borderRadius: 10, resizeMode: 'cover'}}>
          {
              (username !== data.PostedBy)?(
                  <View style = {{position: 'absolute', right: 10, top: 10, backgroundColor: 'white', height: 40, width: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', opacity: 0.7}}>
                    <Pressable onPress = {() =>handleLike(data.title, username, Liked, setLiked)}>
                      <RenderLiked/>
                    </Pressable>
                  </View>
              ):(
                  <View/>
              )
          }

          <View style = {{flexDirection: 'row'}}>
            <RenderIsUsernameSameAsPostedBy/>
            <View>
              <Text style = {{fontSize: 15, fontWeight: 'bold', color: 'white', elevation: 1, paddingTop: 5}}>{data.title}</Text>
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <Image style = {{height: 20, width: 20, marginTop: 4, borderRadius: 20}} source = {{uri: updatedCurrencyList(data.currency)[0].value}}/>
                <Text style = {{color: 'white', fontSize: 15, elevation: 1, marginLeft: 5, marginTop: 5, fontWeight: '500'}}>{updatedCurrencyList(data.currency)[0].price} </Text>
                <Text style = {{color: 'white', fontSize: 11, elevation: 1, fontWeight: '500', marginTop: 5}}>(${Number(data.USD).toLocaleString('en-US')})</Text>
              </View>
            </View>
          </View>

          <FlatList
            data={data.pic}
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const scrollIndex = Math.min(Math.max(0, Math.floor(event.nativeEvent.contentOffset.x / 57)), data.pic.length);
              handleScroll(setIndex, scrollIndex);
            }}
            snapToAlignment={'center'}
            renderItem={({item, k}) => (
              <Image source={{uri: item}} style={{height: 50, width: 50, marginLeft: 7, borderRadius: 10, transform: [{scale: index === k ? 1.1 : 0.9}]}} key={k} />
            )}
          />
        </ImageBackground>
      </View>
    </View>
  );
}
