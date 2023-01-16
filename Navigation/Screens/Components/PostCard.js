import {Text, View, Image, TouchableOpacity, ImageBackground, ScrollView, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';
import { useNavigation } from '@react-navigation/native';

faker.seed(10)

export default function PostCard({data}){
  const images = data.pic
  const navigation = useNavigation(); 
  return (
    <View style = {{ backgroundColor: 'white', marginBottom: 10, margin: 20, borderRadius:10, elevation:2}}>
      <View style ={{width:"100%", height:300}}>
        <ImageBackground source={{uri: data.pic[0]}} imageStyle ={{width:"100%", height:300, borderRadius:10, resizeMode:'cover'}}>
          <View style={{flexDirection:'row'}}>
            <Pressable onPress={() => navigation.navigate("view profile", {ProfileImage: data.profilePic})}>
              <Image style={{height:50, width:50, borderRadius:30, elevation:10, margin:10}} source={{uri:data.profilePic}}/>
            </Pressable>
            <View>
              <Text style ={{fontSize:15, fontWeight:'bold', color:'white', elevation:1, paddingTop:5}}>{data.title}</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'white', fontSize:17, elevation:1}}>{data.price} </Text>
                <Image style={{height:17, width:17, marginTop:3}} source={{uri:data.currency}}/>
              </View>
              <Text style={{color:'white', elevation:1}}><Ionicons name='location-outline' style={{marginRight: 10}} size ={20}/>{data.location}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  )
}



