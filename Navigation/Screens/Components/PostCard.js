import {Text, View, Image, TouchableOpacity, ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function PostCard({ data }){
  return (
    <View style = {{
      backgroundColor: 'white',
      marginBottom: 10,
      margin: 20,
      borderRadius:10,
      elevation:2}}>
      <View style ={{width:"100%", height:300, }}>
        <ImageBackground source={{uri: data.pic}} imageStyle ={{width:"100%", height:300, borderRadius:10}}>
          <Text style ={{fontSize:14, fontWeight:'bold', color:'white'}}>{data.title}</Text>
          <Text style={{color:'white', fontSize:12}}>{data.price} <Text style={{fontSize:10}}>{data.currency}</Text></Text>
          <Text style={{color:'white'}}><Ionicons name='location-outline' style={{marginRight: 10}}/>{data.location}</Text>
        </ImageBackground>
      </View>
    </View>
  )
}



