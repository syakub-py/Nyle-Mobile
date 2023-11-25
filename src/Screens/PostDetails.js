import {
  Dimensions, FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useRef, useEffect, useContext} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import CustomMapMarker from '../Components/CustomMapMarker';
import BackButton from '../Components/BackButton';
import PostedBySameAsUsername from '../Components/PostDetailsComponents/renderIsPostedBySameAsUsername';
import RenderIsCategoryAuto from '../Components/PostDetailsComponents/renderIsCategoryAuto';
import RenderIsCategoryHomes from '../Components/PostDetailsComponents/renderIsCategoryHomes';
import RenderHomesAndAuto from '../Components/PostDetailsComponents/renderHomesAndAuto';
import RenderDescription from '../Components/PostDetailsComponents/renderDescription';
import RenderIsLiked from '../Components/PostDetailsComponents/renderIsLiked';
import MenuButtonModal from '../Components/PostDetailsComponents/renderMenuButtonsModal';
import LikesAndViews from '../Components/PostDetailsComponents/renderLikesAndViews';
import findPost from '../Services/FindPost';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../Contexts/UserContext';
const {width} = Dimensions.get('window');
const height = width;


export default function PostDetails({route}) {
  const postContext = findPost(route.params.id);
  const images = postContext.pictures;
  const likes = postContext.likes;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [more, setMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [Liked, setLiked] = useState(false);
  const smallFlatListRef = useRef(null);
  const mainFlatListRef = useRef(null);
  const navigation =useNavigation();
  const userContext = useContext(UserContext);

  useEffect(()=>{
    smallFlatListRef.current?.scrollToIndex({
      index: currentIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [currentIndex]);

  useEffect(() => {
    setLiked(postContext.isLiked(userContext.username));
    postContext.handleViewCounter();
  }, []);

  const changeIndex = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    setCurrentIndex(slide);
  };

  const scrollToActiveIndex = (index) =>{
    mainFlatListRef.current.scrollToIndex({
      index: index,
      animated: false,
      viewPosition: 0.8,
    });
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style = {{flex: 1}}>
      <ScrollView style = {{backgroundColor: 'white'}} showsVerticalScrollIndicator = {false}>
        <View style = {{zIndex: 1}}>
          <View style = {{position: 'absolute', top: 30, left: 15, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
            <BackButton />
          </View>

          <View style = {{position: 'absolute', top: 30, right: 15, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
            <Pressable onPress = {() => setIsOpen(!isOpen)}>
              <Ionicons name ='reorder-three-outline' size = {30}/>
            </Pressable>
          </View>

          <MenuButtonModal isOpen={isOpen} setIsOpen={setIsOpen}/>

          <View style = {{position: 'absolute', top: 30, right: 75, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
            <Pressable onPress = {() =>postContext.handleLikeCounter(userContext.username, setLiked)}>
              <RenderIsLiked Liked={Liked} size={30}/>
            </Pressable>
          </View>
        </View>

        <View>

          <View style = {{maxWidth: 60, zIndex: 1, bottom: 10, right: 10, paddingHorizontal: 5, position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems: 'center'}}>
            <Text style = {{color: 'white', fontWeight: 'bold'}}>{currentIndex + 1}/{images.length}</Text>
          </View>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={changeIndex}
            ref = {mainFlatListRef}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  navigation.navigate('Photo Collage', {
                    pictures: images,
                    index,
                    title: postContext.title,
                    priceInUSD: postContext.USD,
                  });
                }}
                key={index}
              >
                <View style={{width, height, position: 'relative'}}>
                  <Image style={{width, height}} resizeMode={'cover'} source={{uri: item}} />
                </View>
              </Pressable>
            )}
          />

          <FlatList
            data={images}
            horizontal={true}
            style = {{bottom: 25, paddingHorizontal: 5, position: 'absolute', width: width}}
            contentContainerStyle={{alignItems: 'center'}}
            showsHorizontalScrollIndicator={false}
            ref = {smallFlatListRef}
            initialScrollIndex={currentIndex}
            renderItem={({item, index})=>{
              return (
                <Pressable key = {item} onPress = {() => {
                  scrollToActiveIndex(index);
                }}>
                  <Image source = {{uri: item}} style = {currentIndex === index?{height: 60, width: 60, margin: 7, borderRadius: 10, borderWidth: 2, borderColor: 'white'}:{height: 50, width: 50, margin: 7, borderRadius: 10, alignContent: 'center'}} key = {item}/>
                </Pressable>
              );
            }}
          />

          <View style = {{flexDirection: 'row', position: 'absolute', bottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems: 'center', marginBottom: 5, marginLeft: 5, paddingHorizontal: 3}}>
            <LikesAndViews color={'#e6121d'} iconName={'heart'} data={likes.length}/>
            <LikesAndViews color={'white'} iconName={'eye'} data={postContext.views}/>
          </View>

        </View>

        <View style = {{marginLeft: 10, marginTop: 10}}>

          <View style = {{backgroundColor: 'transparent', flexDirection: 'row'}}>
            <Text style = {{color: 'black', fontSize: 23, fontWeight: 'bold'}}>{postContext.title}</Text>
          </View>

          <View style={{maxWidth: 135, flexDirection: 'row'}}>
            <FlatList horizontal
              data={postContext.updatedCurrencyList()}
              snapToAlignment={'center'}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({item})=>(
                <View style = {{width: 60, backgroundColor: 'transparent', borderRadius: 4, alignItems: 'center', flexDirection: 'row', marginTop: 3, marginRight: 6}}>
                  <Image style = {{height: 20, width: 20, marginRight: 7, borderRadius: 20}} resizeMode = {'cover'} source = {{uri: item.value}}/>
                  <Text style = {{fontSize: 20, fontWeight: 'bold', color: 'black', marginRight: 10}}>{item.price}</Text>
                </View>
              )}
            />
            <Text style={{fontSize: 12, fontWeight: 'bold', color: 'black', alignSelf: 'center'}}>${Number(postContext.USD).toLocaleString('en-US')}</Text>
          </View>


          <RenderIsCategoryHomes postId={postContext.id}/>
          <RenderIsCategoryAuto postId={postContext.id}/>

        </View>
        <PostedBySameAsUsername postId = {postContext.id}/>

        <RenderDescription description={postContext.description} more={more} setMore={setMore}/>

        <Pressable onLongPress = {() => {
          navigation.navigate('Map', {coordinates: postContext.coordinates, firstImage: images[0]});
        }}>
          <View style = {{width: width-50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', elevation: 3}}>
            <MapView style = {{height: '100%', width: '100%'}} initialCamera = {{center: postContext.coordinates, pitch: 0, heading: 0, zoom: 12, altitude: 0}} >
              <Marker coordinate = {postContext.coordinates}>
                <CustomMapMarker firstImage = {images[0]}/>
              </Marker>
              <Circle
                center = {postContext.coordinates}
                radius = {1200}
                fillColor = "rgba(66, 135, 245, 0.2)"
                strokeColor = "rgba(66, 135, 245, 0.7)"
                strokeWidth = {1}
              />
            </MapView>
          </View>
        </Pressable>
        <RenderHomesAndAuto postId={postContext.id}/>
      </ScrollView>
    </SafeAreaView>
  );
}
