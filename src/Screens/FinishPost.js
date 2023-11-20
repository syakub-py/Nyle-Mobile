import PreviewPostCard from '../Components/AddPostsComponents/PreviewPostCard';
import {Dimensions, View, ScrollView, Pressable, Text} from 'react-native';
import {useContext, useState} from 'react';
import {UserContext} from '../Contexts/UserContext';
import {AppContext} from '../Contexts/NyleContext';
import BackButton from '../Components/BackButton';
import React from 'react';
import {CustomTextInput} from '../Components/CustomText';
import RenderAutoSection from '../Components/AddPostsComponents/renderAutoSection';
import RenderHomeDataSection from '../Components/AddPostsComponents/renderHomeSection';
import RenderDetailsText from '../Components/AddPostsComponents/renderDetailsText';
import MapView, {Marker} from 'react-native-maps';
import DropdownInput from '../Components/AddPostDropdown';
import RenderPrice from '../Components/AddPostsComponents/renderPrice';
import {loadingAnimation} from '../Components/LoadingAnimation';
export default function FinishPost({route}) {
  const images = route.params.selectedImages;
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
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);
  const nyleContext = useContext(AppContext);
  const {width} = Dimensions.get('window');
  const categories = [{Label: 'All', Value: 'All'}, {Label: 'Tech', Value: 'Tech'}, {Label: 'Auto', Value: 'Auto'}, {Label: 'Homes', Value: 'Homes'}, {Label: 'Bikes', Value: 'Bikes'}, {Label: 'Bike Parts', Value: 'Bike Parts'}, {Label: 'Jewelry', Value: 'Jewelry'}, {Label: 'Retail/Wholesale', Value: 'Retail/Wholesale'}];
  const [, setIsFocus] = useState(false);

  const dropMarker = (event) => {
    const coordinate = event.nativeEvent;
    setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
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

  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      <View>
        <BackButton/>
      </View>

      <PreviewPostCard postData={createPost(images)}/>

      <CustomTextInput placeholder={'Title'} value={title} onChangeText={(text)=>setTitle(text)} multiline={false}/>
      <View>
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
          setIsFocus={()=>setIsFocus(true)}
        />
      </View>
      <View style = {{width: width-50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden'}}>
        <MapView style = {{height: '100%', width: '100%'}} initialCamera = {{center: coordinates, pitch: 0, heading: 0, zoom: 10, altitude: 0}} onLongPress = {dropMarker}>
          <Marker coordinate = {coordinates}/>
        </MapView>
      </View>
      <RenderPrice setIsFocus={setIsFocus} currencyList={currencyList} setCurrencyList={setCurrencyList} />
      <RenderDetailsText category={category} setDetails={setDetails}/>
      <RenderHomeDataSection category={category} setSQFT={setSQFT} setBathrooms={setBathrooms} setBedrooms={setBedrooms}/>
      <RenderAutoSection category={category} setMake={setMake} setModel={setModel} setVIN={setVIN} setMileage={setMileage}/>

      <View style = {{flexDirection: 'row', position: 'absolute', bottom: 0, height: '10%', width: '100%', justifyContent: 'space-evenly', backgroundColor: 'transparent', alignItems: 'center'}}>
        <View style = {{justifyContent: 'center', backgroundColor: 'whitesmoke', borderWidth: 2, borderColor: 'black', borderRadius: 200, width: 150, height: 50, alignItems: 'center'}}>
          <Pressable>
            <Text style = {{color: 'black', fontSize: 15, fontWeight: 'bold'}}>Cancel</Text>
          </Pressable>
        </View>

        {loadingAnimation(loading)}
        <View style = {{justifyContent: 'center', backgroundColor: 'black', borderRadius: 200, width: 150, height: 50, alignItems: 'center'}}>
          <Pressable onPress = {() => {
            setLoading(true);
            nyleContext.addPost('AllPosts', createPost(images)).then(()=>{
              setLoading(false);
            });
          }}>
            <Text style = {{color: 'white', fontSize: 15, fontWeight: 'bold'}}>Post</Text>
          </Pressable>
        </View>
      </View>
      <View style={{height: 200}}/>
    </ScrollView>
  );
}
