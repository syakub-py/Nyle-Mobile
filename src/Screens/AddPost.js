import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  Vibration,
  FlatList,
  Alert,
  Pressable,
  Text,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {useNavigation} from '@react-navigation/native';

const fetchImages = async () => {
  const {status} = await MediaLibrary.requestPermissionsAsync();
  const results = [];
  if (status === 'granted') {
    const album = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: 60,
      sortBy: [['creationTime', true]],
    });
    album.assets.map((item)=>{
      results.push(item.uri);
    });
    return results;
  } else {
    Alert.alert('Permission denied');
  }
};

export default function AddPost() {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const {width} = Dimensions.get('window');
  const height = 300;
  const navigation = useNavigation();

  useEffect(()=>{
    fetchImages().then((result)=>{
      setImageUrls(result);
    });
  }, []);

  const handleToggleImage = (item) =>{
    setSelectedImages([...selectedImages, item]);
    Vibration.vibrate(10);
  };

  return (
    <FlatList
      data={imageUrls}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{alignItems: 'center', backgroundColor: 'white', flexGrow: 1}}
      ListHeaderComponent={
        <View style={{marginBottom: 5, paddingBottom: 10}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10}}>Add Post</Text>
          {
            (selectedImages.length>0)?(
              <Image source={{uri: selectedImages[0]}} style={{width: width-20, height: height, borderRadius: 10, marginLeft: 10, marginRight: 10}}/>
            ):(
              <Image source={{uri: imageUrls[0]}} style={{width: width-20, height: height, borderRadius: 10, marginLeft: 10, marginRight: 10}}/>
            )
          }
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Pressable onPress={()=>navigation.navigate('Finish Post', {selectedImages: selectedImages})}>
              <View style={{backgroundColor: 'black', width: 100, height: 25, borderRadius: 20, justifyContent: 'center', marginTop: 15, marginRight: 10}}>
                <Text style={{color: 'white', alignSelf: 'center'}}>Next</Text>
              </View>
            </Pressable>
          </View>

        </View>
      }
      renderItem={({item}) => (
        <Pressable onLongPress={()=>handleToggleImage(item)}>
          <Image source={{uri: item}}
            style={{
              width: width/3.25,
              height: 100,
              margin: 3,
              borderRadius: 4,
            }} />
        </Pressable>
      )}
      numColumns={3}
    />
  );
}

