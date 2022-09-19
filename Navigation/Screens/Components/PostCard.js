import {Text, View, Image, TouchableOpacity, ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';

faker.seed(10)

export default function PostCard({ data }){
  return (
    <View style = {{
      backgroundColor: 'white',
      marginBottom: 10,
      margin: 20,
      borderRadius:10,
      elevation:2}}>
      <View style ={{width:"100%", height:300}}>
        <ImageBackground source={{uri: data.pic}} imageStyle ={{width:"100%", height:300, borderRadius:10}}>
          <View style={{flexDirection:'row'}}>
            <Image style={{height:50, width:50, borderRadius:30, elevation:1, margin:10}} source={{uri: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`}}></Image>
            <View>
              <Text style ={{fontSize:15, fontWeight:'bold', color:'white'}}>{data.title}</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'white', fontSize:17}}>{data.price} </Text>
                <Image style={{height:17, width:17}} source={{uri:data.currency}}/>
              </View>
              <Text style={{color:'white'}}><Ionicons name='location-outline' style={{marginRight: 10}}/>{data.location}</Text>
            </View>
          </View>         
        </ImageBackground>
      </View>
    </View>
  )
}



