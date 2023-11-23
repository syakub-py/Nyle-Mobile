import _ from 'lodash';
import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';


export default function RenderMessageImage({props}) {
  const [state, setState] = useState({active: 0});
  const navigation =useNavigation();
  const isStateActiveCSS = (state, k) => {
    if (k === state.active) return {color: 'white', margin: 4, fontSize: 10};
    return {color: '#a8a5a5', margin: 4, fontSize: 7};
  };
  const changeIndex = ({nativeEvent}) => {
    const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
    if (slide !== state.active) setState({active: slide});
  };


  if (_.isEmpty(props.currentMessage.image)) return <View/>;
  else {
    return (
      <View style = {{width: 200, height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
        <Pressable onLongPress= {() =>navigation.navigate('Image Viewer', {pictures: props.currentMessage.image})}>
          <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false} pagingEnabled = {true} onScroll = {changeIndex} style = {{width: 200, height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
            {
              props.currentMessage.image.map((image, index) => {
                return (
                  <Image
                    key = {index}
                    source = {{uri: image}}
                    style = {{
                      width: 200,
                      height: 200,
                      borderRadius: 15,
                    }}
                    resizeMode = "cover"
                  />
                );
              })}
          </ScrollView>
          <View style = {{flexDirection: 'row', position: 'absolute', bottom: 0, alignSelf: 'center', alignItems: 'center'}}>
            {
              props.currentMessage.image.map((i, k) => (
                <Text style = {isStateActiveCSS(state, k)} key = {k}>⬤</Text>
              ))
            }
          </View>
        </Pressable>
      </View>
    );
  }
}
