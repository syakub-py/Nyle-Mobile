import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';


export default function CloseButton({setModalVisible}) {
  return (
    <Pressable onPress={()=>setModalVisible(false)} style={{zIndex: 1, backgroundColor: 'white', borderColor: 'lightgrey', borderWidth: 1, height: 30, width: 30, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
      <Ionicons name={'close-outline'} size={20}/>
    </Pressable>
  );
}
