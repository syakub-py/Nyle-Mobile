import {Text, View, Image, ImageBackground, Pressable, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';

export default function PostCard({data}){
  const navigation = useNavigation(); 
  const [iconName, setIconName] = React.useState('bookmark-outline');
  return (
    <View style = {{ backgroundColor: 'white', marginBottom: 10, margin: 20, borderRadius:10, elevation:3}}>
      <View style ={{width:"100%", height:300}}>
        <ImageBackground source={{uri: data.pic[0]}} imageStyle ={{width:"100%", height:300, borderRadius:10, resizeMode:'cover'}}>
          <View style={{position:'absolute', right:10,top:10, backgroundColor:'white', height:40, width:40, borderRadius:100, justifyContent:'center', alignItems:'center', opacity:0.7}}>
            
            <Pressable onPress={()=>{setIconName("bookmark")}}>
              <Ionicons name={iconName} size={25}/>
            </Pressable>

          </View>
            <View style={{flexDirection:'row'}}>
              <Pressable onPress={() => navigation.navigate("view profile", {ProfileImage: data.profilePic})}>
                <Image style={{height:50, width:50, borderRadius:30, elevation:10, margin:12}} source={{uri:data.profilePic}}/>
              </Pressable>
              <View>
                <Text style ={{fontSize:15, fontWeight:'bold', color:'white', elevation:1, paddingTop:5}}>{data.title}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Image style={{height:17, width:17, marginTop:3, borderRadius:20}} source={{uri:data.currency}}/>
                  <Text style={{color:'white', fontSize:15, elevation:1, margin:3, fontWeight:'500'}}>{data.price} </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
      </View>
    </View>
  )
}

