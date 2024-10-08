import React, {useRef} from 'react';
import {Animated, Dimensions, FlatList, Image, StyleSheet, View} from 'react-native';
import BackButton from '../Components/BackButton';


export default function ImageViewer({route}) {
  const {pictures} = route.params;
  const width = Dimensions.get('window').width;
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <View style={{flex: 1}}>
      <View style={{backgroundColor: 'transparent', zIndex: 1, position: 'absolute', top: 40, left: 20}}>
        <BackButton/>
      </View>
      <View style={[StyleSheet.absoluteFillObject]}>
        {
          pictures.map((image, index)=>{
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
            });
            return (
              <Animated.Image
                key={`image-${index}`}
                source={{uri: image}}
                blurRadius={20}
                style={[StyleSheet.absoluteFillObject, {opacity}]}
              />
            );
          })
        }
      </View>
      <FlatList data={pictures}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false})}
        bounces={false}
        renderItem={({item})=>{
          return (
            <View style={{
              width: width,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: 'black',
              shadowOpacity: 0.5,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowRadius: 20,
            }}>
              <Image source={{uri: item}} style={{width: width-30, height: 400, resizeMode: 'cover', borderRadius: 13}}/>
            </View>
          );
        }}/>
    </View>
  );
}
