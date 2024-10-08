import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import React, {useState, useEffect, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomMapMarker from '../Components/CustomMapMarker';
import MapPostCard from '../Components/MapPostCard';
import BackButton from '../Components/BackButton';
import {AppContext} from '../Contexts/NyleContext';
import {UserContext} from '../Contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import CategoriesCarousell from '../Components/HomeComponents/CategoriesCarousell';

const {width} = Dimensions.get('window');


export default function HomeMapView() {
  const [masterData, setMasterData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nyleContext = useContext(AppContext);
  const userContext = useContext(UserContext);
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const currentIndex = Math.floor(contentOffset.x / 245);

    setCurrentIndex(currentIndex);
  };


  useEffect(() => {
    nyleContext.readNextTwoElements('AllPosts').then((result)=>{
      setMasterData(result);
    });
  }, []);


  return (
    <View style = {{flex: 1}}>
      <View style = {{zIndex: 1}}>
        <View style = {{position: 'absolute', top: 30, left: 15, height: 50, width: 50, elevation: 2, backgroundColor: 'white', borderRadius: 13, alignItems: 'center', justifyContent: 'center'}}>
          <BackButton />
        </View>


        <View style = {{position: 'absolute', alignSelf: 'center', height: 100, width: 130, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
          <Ionicons name ='location' size = {30} style = {{marginRight: 5}} color = {'red'}/>
          <Text style = {{fontSize: 18, fontWeight: 'bold'}}>Queens, New York</Text>
        </View>

        <View style = {{position: 'absolute', top: 30, right: 15, height: 50, width: 50, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
          <Image source={{uri: userContext.profilePicture}} style={{borderRadius: 13, height: '100%', width: '100%'}}/>
        </View>
      </View>

      <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
        <View style = {{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          height: 50,
          borderRadius: 15,
          margin: 10,
          elevation: 2,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 1,
          shadowRadius: 4,
          zIndex: 1,
          position: 'absolute',
          top: 80,
          width: '95%',
        }}>
          <Ionicons name = "search-outline" style = {{paddingLeft: 20}} size = {25} color ='gray' />
          <TextInput
            placeholder ='Search Nyle...'
            placeholderTextColor ='gray'
            style = {{
              flex: 1,
              fontWeight: '400',
              backgroundColor: 'transparent',
              margin: 10,
              paddingHorizontal: 5,
              fontSize: 16,
              color: 'black',
            }}
          />
        </View>

      </View>
      <View style = {{zIndex: 1, position: 'absolute', top: 140}}>
        <CategoriesCarousell masterData={masterData}/>
      </View>


      <MapView style = {{height: '100%', width: '100%'}} initialCamera = {{center: {latitude: 40.849113, longitude: -101.325992}, pitch: 0, heading: 0, zoom: 1, altitude: 0}}>
        {masterData.map((item, index) => (
          <View key = {index}>
            <Marker coordinate = {item.coordinates}>
              <CustomMapMarker firstImage = {item.pictures[0]} />
            </Marker>

            <Circle
              center = {item.coordinates}
              radius = {1200}
              fillColor = "rgba(66, 135, 245, 0.2)"
              strokeColor = "rgba(66, 135, 245, 0.7)"
              strokeWidth = {1}
            />
          </View>
        ))}
      </MapView>

      <View style = {{position: 'absolute', bottom: 10, width: '100%'}}>
        <FlatList
          data={masterData}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          snapToAlignment={'center'}
          showsHorizontalScrollIndicator={false}
          onEndReached={()=>{
            nyleContext.handleEndOfScreenReached();
          }}
          renderItem={({item, index})=>{
            return (
              <Pressable key = {index} onPress = {() =>navigation.navigate('post details', {id: item.id})}>
                <View style={{
                  flex: 1,
                  height: 170,
                  width: 230,
                  margin: 15,
                  flexDirection: 'row',
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 4,
                  transform: [
                    {scale: index === currentIndex ? 1.1 : 1},
                  ],
                  marginLeft: index === 0 ? width/2-230/2 : 15,
                  marginRight: index === masterData.length - 1 ? width/2 - 230/2 : 15,
                }}>
                  <MapPostCard postContext = {new Post(item)} />
                </View>
              </Pressable>
            );
          }}/>
      </View>

    </View>

  );
}
