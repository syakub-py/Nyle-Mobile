import React, {useContext, useEffect, useRef, useState} from 'react';
import {FlatList, Image, ImageBackground, Pressable, Text, View} from 'react-native';
import {UserContext} from '../../Contexts/UserContext';


export default function PreviewPostCard({selectedImages}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const smallFlatListRef = useRef(null);
  const mainFlatListRef = useRef(null);
  const ITEM_WIDTH = 365;
  const ITEM_HEIGHT = 300;
  const FLATLIST_WIDTH = 140;
  const FLATLIST_PICTURE_DIMENSIONS = 40;
  const userContext = useContext(UserContext);

  const change = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    setCurrentIndex(slide);
  };

  useEffect(()=>{
    smallFlatListRef.current?.scrollToIndex({
      index: currentIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [currentIndex]);
  const scrollToActiveIndex = (index) =>{
    mainFlatListRef.current.scrollToIndex({
      index: index,
      animated: false,
    });
    setCurrentIndex(index);
  };
  return (
    <View style={{backgroundColor: 'transparent', borderRadius: 10, margin: 10}}>
      <View style={{flexDirection: 'row', position: 'absolute', top: 12, left: 10, zIndex: 1}}>
        <Image style = {{height: 50, width: 50, borderRadius: 15, marginLeft: 12, marginRight: 12}} source = {{uri: userContext.profilePicture}}/>
        <View style={{marginLeft: 5}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white', elevation: 1}}>Test Title</Text>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}> */}
          {/*   <Image style={{height: 20, width: 20, marginTop: 4, borderRadius: 20}} source={{uri: updatedCurrencyList(data.currencies)[0].value}}/> */}
          {/*   <Text style={{color: 'white', fontSize: 15, elevation: 1, marginLeft: 5, fontWeight: '500'}}>{updatedCurrencyList(data.currencies)[0].price} </Text> */}
          {/*   <Text style={{color: 'white', fontSize: 11, elevation: 1, fontWeight: '500'}}>(${Number(data.USD).toLocaleString('en-US')})</Text> */}
          {/* </View> */}
        </View>
      </View>
      <FlatList
        data={selectedImages}
        horizontal
        pagingEnabled
        onScroll={change}
        ref = {mainFlatListRef}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'center'}
        renderItem={({item}) => (
          <ImageBackground source={{uri: item}} imageStyle={{borderRadius: 10, resizeMode: 'cover'}} style={{width: ITEM_WIDTH, height: ITEM_HEIGHT, borderRadius: 10, zIndex: 0}}/>
        )}
      />

      <FlatList
        data={selectedImages}
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
              <Image source = {{uri: item}} style = {{height: FLATLIST_PICTURE_DIMENSIONS, width: FLATLIST_PICTURE_DIMENSIONS, transform: [{scale: index === currentIndex ? 1.2 : scaleFactor}], borderRadius: 6, borderWidth: index === currentIndex ?2:0, borderColor: index === currentIndex ?'white':'transparent', marginLeft: index === 0 ? FLATLIST_WIDTH/2-(FLATLIST_PICTURE_DIMENSIONS/2) : 3, marginRight: index === selectedImages.length - 1 ? FLATLIST_WIDTH/2 - (FLATLIST_PICTURE_DIMENSIONS/2) : 3}} key = {item}/>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
