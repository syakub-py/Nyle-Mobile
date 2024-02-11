import {Pressable, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';

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
export default function Actions({imageUrls, setImageUrls}) {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', margin: 7}}>
      <Pressable onPress={() => selectImages(imageUrls, setImageUrls)}>
        <Ionicons name="images" size={25}/>
      </Pressable>
    </View>
  );
};
