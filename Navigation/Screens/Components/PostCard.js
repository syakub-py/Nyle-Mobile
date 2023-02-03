import {Text, View, Image, ImageBackground, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

faker.seed(10)

export default function PostCard({data}){
  const navigation = useNavigation(); 
  return (
    <View style = {{ backgroundColor: 'white', marginBottom: 10, margin: 20, borderRadius:10, elevation:3}}>
      <View style ={{width:"100%", height:300}}>
        <ImageBackground source={{uri: data.pic[0]}} imageStyle ={{width:"100%", height:300, borderRadius:10, resizeMode:'cover'}}>
          <View style={{position:'absolute', right:10,top:10, backgroundColor:'white', height:40, width:40, borderRadius:100, justifyContent:'center', alignItems:'center', opacity:0.7}}>
            <Ionicons name='bookmark-outline' size={25} />
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

            {/* <View style={{flexDirection:'row', alignItems:'center', elevation:2}}>
              <Image source={{uri: data.profilePic}} style={{position: 'absolute', top:190,  right:10, height:30, width:30, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:100, borderWidth:2, borderColor:'white'}}/>
              <Image source={{uri: data.profilePic}} style={{position: 'absolute', top:190,  right:30,height:30, width:30, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:100, borderWidth:2, borderColor:'white'}}/>
              <Image source={{uri: data.profilePic}} style={{position: 'absolute', top:190,  right:50,height:30, width:30, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:100, borderWidth:2, borderColor:'white'}}/>
            </View> */}
          
          </ImageBackground>
      </View>
    </View>
  )
}