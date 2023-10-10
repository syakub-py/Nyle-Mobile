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
import React, {useState, useRef, useEffect} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import {firestore} from '../Components/Firebase';
import {generateRating, handleLike, isLiked, updatedCurrencyList} from './GlobalFunctions';
import CustomMapMarker from '../Components/CustomMapMarker';
import BackButton from '../Components/BackButton';
import PostedBySameAsUsername from '../Components/PostDetailsComponents/renderIsPostedBySameAsUsername';
import RenderIsCategoryAuto from '../Components/PostDetailsComponents/renderIsCategoryAuto';
import RenderIsCategoryHomes from '../Components/PostDetailsComponents/renderIsCategoryHomes';
import RealEstateData from '../Components/PostDetailsComponents/renderIsRealEstateData';
import RenderHomesAndAuto from '../Components/PostDetailsComponents/renderHomesAndAuto';
import RenderArrangePickup from '../Components/PostDetailsComponents/renderArrangePickup';
import RenderDescription from '../Components/PostDetailsComponents/renderDescription';
import RenderIsLiked from '../Components/PostDetailsComponents/renderIsLiked';
import MenuButtonModal from '../Components/PostDetailsComponents/renderMenuButtonsModal';
import LikesAndViews from '../Components/PostDetailsComponents/renderLikesAndViews';
import ErrorPopUp from '../Components/ErrorPopUp';
const {width} = Dimensions.get('window');
const height =width;

/*
    @route.params = {Currency:url of the currency, CurrentUserProfilePic:current users profile picture, DatePosted:the date the post was posted, Description: description of the post, details: minor details of post, Likes: array of usernames that liked the post, PostTitle:the title of the post, images:array of urls of the images of the post, postedBy:the user that made the post, username:the current username, views: number of views}
*/

const handleViewCounter = (setViews, item) => {
  const PostRef = firestore.collection('AllPosts').doc(item.title);
  PostRef.get()
      .then((doc) => {
        const currentViews = doc.data().views;
        setViews(currentViews + 1);
        PostRef.update({views: currentViews + 1})
            .then(() => {
            })
            .catch((error) => {
              console.error('Error adding value to views:', error);
            });
      });
};

const getRealEstateData = async (address, setRealEstateData) => {
  try {
    const response = await fetch(`http://192.168.255.115:5000/api/getOwner/?address=${address.toUpperCase()}`);
    setRealEstateData(response.json());
  } catch (error) {
    console.log('server offline');
  }
};

export default function PostDetails({route, navigation}) {
  const images = route.params.item.pic;
  const likes = route.params.item.likes;
  const username =route.params.username;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [more, setMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [views, setViews] = useState(0);
  const scrollViewRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const [realEstateData, setRealEstateData] = useState([]);
  const [Liked, setLiked] = useState(isLiked(likes, username));

  useEffect(()=>{
    scrollViewRef.current?.scrollToIndex({
      index: currentIndex,
      animated: true,
      viewPosition: 0.8,
    });
  }, [currentIndex]);


  useEffect(() => {
    try {
      handleViewCounter(setViews, route.params.item);
      generateRating(route.params.item.PostedBy, setRating, setNumOfReviews);
      if (route.params.item.category === 'Homes') {
        // "79-33 213 street"
        getRealEstateData(route.params.item.title, setRealEstateData);
      }
    } catch (e) {
      return (
        <ErrorPopUp error={e}/>
      );
    }
  }, []);


  const change = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    setCurrentIndex(slide);
  };

  return (
    <SafeAreaView style = {{flex: 1}}>
      <ScrollView style = {{backgroundColor: 'white'}} showsVerticalScrollIndicator = {false}>
        <View style = {{zIndex: 1}}>
          <View style = {{position: 'absolute', top: 30, left: 15, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
            <BackButton navigation={navigation}/>
          </View>

          <View style = {{position: 'absolute', top: 30, right: 15, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
            <Pressable onPress = {() => setIsOpen(!isOpen)}>
              <Ionicons name ='reorder-three-outline' size = {30}/>
            </Pressable>
          </View>

          <MenuButtonModal isOpen={isOpen} setIsOpen={setIsOpen}/>

          <View style = {{position: 'absolute', top: 30, right: 75, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, opacity: 0.7, alignItems: 'center', justifyContent: 'center'}}>
            <Pressable onPress = {() =>handleLike(route.params.item.title, username, Liked, setLiked)}>
              <RenderIsLiked Liked={Liked} size={30}/>
            </Pressable>
          </View>
        </View>

        <View>

          <View style = {{maxWidth: 60, zIndex: 1, bottom: 10, right: 10, paddingHorizontal: 5, position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems: 'center'}}>
            <Text style = {{color: 'white', fontWeight: 'bold'}}>{currentIndex + 1}/{images.length}</Text>
          </View>

          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator = {false} onScroll = {change}>
            {
              images.map((image, key) => (
                <Pressable onPress = {() => {
                  navigation.navigate('Photo Collage', {pictures: images, index: key, title: route.params.item.title});
                }} key = {key}>
                  <View style = {{width, height, position: 'relative'}} >
                    <Image style = {{width, height}} resizeMode = {'cover'} source = {{uri: image}} key = {key}/>
                  </View>
                </Pressable>
              ),
              )
            }
          </ScrollView>

          <FlatList
            data={images}
            horizontal={true}
            style = {{bottom: 25, paddingHorizontal: 5, position: 'absolute', width: width}}
            contentContainerStyle={{alignItems: 'center'}}
            showsHorizontalScrollIndicator={false}
            ref = {scrollViewRef}
            initialScrollIndex={currentIndex}
            renderItem={({item, index})=>{
              return (
                <Pressable key = {item} onPress = {() => {
                  console.log(currentIndex+1);
                }}>
                  <Image source = {{uri: item}} style = {currentIndex === index?{height: 60, width: 60, margin: 7, borderRadius: 10}:{height: 50, width: 50, margin: 7, borderRadius: 10, alignContent: 'center'}} key = {item}/>
                </Pressable>
              );
            }}
          />

          <View style = {{flexDirection: 'row', position: 'absolute', bottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems: 'center', marginBottom: 5, marginLeft: 5, paddingHorizontal: 3}}>
            <LikesAndViews color={'#e6121d'} iconName={'heart'} data={route.params.item.likes.length}/>
            <LikesAndViews color={'white'} iconName={'eye'} data={views}/>
          </View>

        </View>

        <View style = {{marginLeft: 10, marginTop: 10}}>

          <View style = {{backgroundColor: 'transparent', flexDirection: 'row'}}>
            <Text style = {{color: 'black', fontSize: 23, fontWeight: 'bold'}}>{route.params.item.title}</Text>
            {/* <Text style = {{color:'lightgray', margin:10,fontSize:14, fontWeight:'semi-bold', alignSelf:'center'}}>({parseDateString(route.params.item.date).toString()})</Text>*/}
          </View>

          <View style={{width: 60}}>
            <FlatList horizontal
              data={updatedCurrencyList(route.params.item.currency)}
              snapToAlignment={'center'}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({item})=>(
                <View style = {{width: 60, backgroundColor: 'transparent', borderRadius: 4, alignItems: 'center', flexDirection: 'row', marginTop: 5}}>
                  <Image style = {{height: 20, width: 20, marginRight: 7, borderRadius: 20}} resizeMode = {'cover'} source = {{uri: item.value}}/>
                  <Text style = {{fontSize: 20, fontWeight: 'bold', color: 'black', marginRight: 10}}>{item.price}</Text>
                </View>
              )}
            />
          </View>

          <Text style = {{fontSize: 12, fontWeight: 'bold', color: 'black'}}>(${route.params.item.USD})</Text>

          <RenderIsCategoryHomes item={route.params.item}/>
          <RenderIsCategoryAuto item={route.params.item}/>

        </View>
        <PostedBySameAsUsername params={route.params} username = {username} rating={rating} numOfReviews={numOfReviews} navigation={navigation}/>

        <RenderDescription description={route.params.item.description} more={more} setMore={setMore}/>

        <Pressable onLongPress = {() => {
          navigation.navigate('Map', {coordinates: route.params.item.coordinates, firstImage: images[0]});
        }}>
          <View style = {{width: width-50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', elevation: 3}}>
            <MapView style = {{height: '100%', width: '100%'}} initialCamera = {{center: route.params.item.coordinates, pitch: 0, heading: 0, zoom: 12, altitude: 0}} >
              <Marker coordinate = {route.params.item.coordinates}>
                <CustomMapMarker firstImage = {images[0]}/>
              </Marker>
              <Circle
                center = {route.params.item.coordinates}
                radius = {1200}
                fillColor = "rgba(66, 135, 245, 0.2)"
                strokeColor = "rgba(66, 135, 245, 0.7)"
                strokeWidth = {1}
              />
            </MapView>
          </View>
        </Pressable>


        <RenderHomesAndAuto item={route.params.item}/>

        <RealEstateData item = {route.params.item} realEstateData={realEstateData}/>


      </ScrollView>

      <RenderArrangePickup item={route.params.item} username={username} profilePic={ route.params.CurrentUserProfilePic} navigation={navigation}/>

      {/* <View style = {{flexDirection:'row', position: 'absolute', bottom: 0, height:'10%', width:'100%', justifyContent:'space-evenly', backgroundColor:'transparent', alignItems:'center'}}>*/}
      {/*    <View style = {{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>*/}
      {/*        <Pressable>*/}
      {/*            <Text style = {{color:'white', fontSize:15, fontWeight:"bold"}}>Place Bid</Text>*/}
      {/*        </Pressable>*/}
      {/*    </View>*/}

      {/*    <View style = {{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>*/}
      {/*        <Pressable onPress = {() => navigation.navigate("Check Out", {title: route.params.PostTitle, price:route.params.Price, currency: route.params.Currency})}>*/}
      {/*            <Text style = {{color:'white', fontSize:15, fontWeight:"bold"}}>Buy out</Text>*/}
      {/*        </Pressable>*/}
      {/*    </View>*/}
      {/* </View>*/}
    </SafeAreaView>
  );
}
