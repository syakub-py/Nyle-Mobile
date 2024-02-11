import {ScrollView, View} from 'react-native';
import {InputToolbar} from 'react-native-gifted-chat';
import React from 'react';
import ImageUrls from './ImageUrls';


export default function MessageInputToolbar({imageUrls, setImageUrls, animating, ...props}) {
  return (
    <View style = {{flex: 1}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator = {false}
        style = {{
          position: 'absolute',
          bottom: 55,
          left: 0,
          right: 0,
          height: 75,
        }}>
        <ImageUrls imageUrls={imageUrls} setImageUrls={setImageUrls} animating={animating}/>
      </ScrollView>
      <View style = {{flex: 1}}>
        <InputToolbar
          {...props}
          primaryStyle = {{
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 5,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        />
      </View>
    </View>
  );
};
