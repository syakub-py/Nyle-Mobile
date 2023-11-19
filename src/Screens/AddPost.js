import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  SafeAreaView,
  ActivityIndicator, Vibration, FlatList,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropdownInput from '../Components/AddPostDropdown';
import {CustomText, CustomTextWithInput} from '../Components/CustomText';
import RenderPrice from '../Components/AddPostsComponents/renderPrice';
import ImageUrls from '../Components/AddPostsComponents/renderIsImages';
import RenderDetailsText from '../Components/AddPostsComponents/renderDetailsText';
import RenderHomeDataSection from '../Components/AddPostsComponents/renderHomeSection';
import RenderAutoSection from '../Components/AddPostsComponents/renderAutoSection';
import {AppContext} from '../Contexts/NyleContext';
import {UserContext} from '../Contexts/UserContext';


const currencies = [
  {label: 'Bitcoin', value: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'},
  {label: 'Ethereum', value: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'},
  {label: 'Doge Coin', value: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256'},
  {label: 'USD', value: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389'},
  {label: 'Solana', value: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422'},
];


const selectImages = async (imageUrls, setImageUrls) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
  });

  if (!result.canceled) {
    const currentImageUrls = [...imageUrls];
    const fileJson = result.assets;
    fileJson.forEach((element) => {
      currentImageUrls.push(element.uri);
    });
    setImageUrls(currentImageUrls);
  }
};

const onRefresh = (setRefreshing) => {
  setRefreshing(true);
  Vibration.vibrate(100);
  setTimeout(() => setRefreshing(false), 1000);
};


export default function AddPost() {
  const [refresh, setRefreshing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
  const [category, setCategory] = useState('All');
  const [VIN, setVIN] = useState('');
  const [mileage, setMileage] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [SQFT, setSQFT] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [, setIsFocus] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const smallFlatListRef = useRef(null);
  const mainFlatListRef = useRef(null);
  const nyleContext = useContext(AppContext);
  const userContext = useContext(UserContext);
  const {width} = Dimensions.get('window');
  const {height} = Dimensions.get('window');
  const categories = [{Label: 'All', Value: 'All'}, {Label: 'Tech', Value: 'Tech'}, {Label: 'Auto', Value: 'Auto'}, {Label: 'Homes', Value: 'Homes'}, {Label: 'Bikes', Value: 'Bikes'}, {Label: 'Bike Parts', Value: 'Bike Parts'}, {Label: 'Jewelry', Value: 'Jewelry'}, {Label: 'Retail/Wholesale', Value: 'Retail/Wholesale'}];

  useEffect(()=>{
    if (currentIndex<0) {
      smallFlatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    };
  }, [currentIndex]);

  const change = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    setCurrentIndex(slide);
  };

  const dropMarker = (event) => {
    const coordinate = event.nativeEvent;
    setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
  };

  const deleteImages = (image) => {
    setImageUrls(imageUrls.filter((item) =>(image!==item)));
  };

  const createPost = (localImageUrls) => {
    let uniqueFields = {};

    if (category === 'Auto') {
      uniqueFields = {
        Vin: VIN || '',
        mileage: mileage || 0,
        make: make || '',
        model: model || '',
      };
    } else if (category === 'Homes') {
      uniqueFields = {
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        SQFT: SQFT || 0,
      };
    } else {
      uniqueFields = {
        details: details || '',
      };
    }
    return {
      id: Math.floor(Math.random() * 100),
      title: title || '',
      postedBy: userContext.username || '',
      currencies: currencyList || '',
      description: description || '',
      pictures: localImageUrls || [],
      profilePicture: userContext.profilePicture || '',
      coordinates: coordinates || {},
      views: 0,
      likes: [],
      sold: false,
      category: category || '',
      date: new Date().toLocaleString(),
      ...uniqueFields,
    };
  };

  const load = (loading) => {
    if (!loading) return null;
    return <ActivityIndicator size = "large" color = "black" animating = {loading} />;
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
    <SafeAreaView style = {{backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle = {{paddingBottom: 60}} refreshControl = {<RefreshControl refreshing = {refresh} onRefresh = {()=>onRefresh(setRefreshing)}/>} >
        <View>
          <FlatList
            data={imageUrls}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={change}
            ref = {mainFlatListRef}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View key = {index}>
                <Image source = {{uri: item}} style = {{height: height, width: width}}/>
              </View>
            )}
          />

          <FlatList
            data={imageUrls}
            horizontal={true}
            style = {{bottom: 25, paddingHorizontal: 5, position: 'absolute', width: width}}
            contentContainerStyle={{alignItems: 'center'}}
            showsHorizontalScrollIndicator={false}
            ref = {smallFlatListRef}
            initialScrollIndex={currentIndex}
            renderItem={({item, index})=>{
              return (
                <>
                  <Pressable style = {{zIndex: 1}} onPress = {() => {
                    deleteImages(index);
                  }}>
                    <View style = {styles.shadowBox}>
                      <View style = {styles.circle}>
                        <Ionicons name ='remove-outline' color = {'white'} size = {15} style = {{elevation: 1}}/>
                      </View>
                    </View>
                  </Pressable>
                  <Pressable key = {item} onPress={()=>scrollToActiveIndex(index)}>
                    <Image source = {{uri: item}} style = {{height: 50, width: 50, margin: 10, borderRadius: 10, alignContent: 'center'}}/>
                  </Pressable>
                </>
              );
            }}
          />
        </View>
        <ImageUrls imageUrls={imageUrls} setImageUrls={setImageUrls} selectImages={selectImages}/>
        <View>
          <CustomTextWithInput
            text="Title"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
        </View>

        <View>
          <Text style = {{fontSize: 25, fontWeight: 'bold', color: 'black', margin: 10}}>Category</Text>
          <DropdownInput
            data={categories}
            labelField = "Label"
            valueField = "Value"
            placeholder = "Select item"
            onChange = {(item) => {
              setCategory(item.Value);
            }}
            value = {category}
            customStyle = {{
              marginLeft: 35,
              marginRight: 35,
            }}
            setIsFocus={()=>setIsFocus(false)}
          />

        </View>

        <View >
          <RenderPrice currencies={currencies} currencyList={currencyList} setCurrencyList={setCurrencyList} setIsFocus={setIsFocus}/>
        </View>

        <CustomText text="Location" />
        <View style = {{width: width-50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden'}}>
          <MapView style = {{height: '100%', width: '100%'}} initialCamera = {{center: coordinates, pitch: 0, heading: 0, zoom: 10, altitude: 0}} onLongPress = {dropMarker}>
            <Marker coordinate = {coordinates}/>
          </MapView>
        </View>

        <RenderDetailsText category={category} setDetails={setDetails}/>
        <RenderHomeDataSection category={category} setSQFT={setSQFT} setBathrooms={setBathrooms} setBedrooms={setBedrooms}/>
        <RenderAutoSection category={category} setMake={setMake} setModel={setModel} setVIN={setVIN} setMileage={setMileage}/>
        <View>
          <CustomTextWithInput
            text="Description"
            onChangeText={(text) => setDescription(text)}
            multiline={true}
            height={200}
            value={description}
          />
        </View>

        {load(loading)}
        <Pressable onPress = {() => {
          setLoading(true);
          nyleContext.addPost('AllPosts', createPost(imageUrls)).then(()=>setLoading(false));
        }}>
          <View style = {{marginBottom: 20, marginLeft: 10, marginRight: 10, backgroundColor: 'black', borderRadius: 20, alignItems: 'center'}}>
            <Text style = {{margin: 10, color: 'white', fontWeight: 'bold'}}>Add post</Text>
          </View>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textinput: {
    backgroundColor: 'whitesmoke',
    marginLeft: 35,
    marginRight: 35,
    fontSize: 15,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  shadowBox: {
    position: 'absolute',
    left: 5,
    top: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  circle: {
    backgroundColor: 'red',
    height: 20,
    width: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
