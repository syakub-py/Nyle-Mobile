import {Text, View, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const PostCard = ({ data }) => {
  return (
    <TouchableOpacity >
      <View style = {{
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        margin: 20
      }}>
        <View style ={{width:"100%", height:200}}>
          <Image
          source={require("./test.jpg")}
          resizeMode = "cover"
          style = {{
            width:"100%",
            height:"100%",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}/>
        </View>
        <Text style ={{fontSize:14, fontWeight:'bold'}}>{data.title}</Text>
        <Text style={{color:'black', fontSize:12}}>{data.price} <Text style={{fontSize:10}}>{data.currency}</Text></Text>
        <Text><Ionicons name='location-outline' style={{marginRight: 10}}/>{data.location}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default PostCard;

