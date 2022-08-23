import {Text, View, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ data }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity >
      <View style = {{
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        margin: 20
      }}>
        <View style ={{width:"100%", height:250}}>
          <Image
          source={data.pictures}
          resizeMode = "cover"
          style = {{
            width:"100%",
            height:"100%",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
          />
        </View>
        <Text style ={{fontSize:14, fontWeight:'bold'}}>{data.title}</Text>
        <Text>{data.price} {data.currency}</Text>
        <Text>{data.location}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default PostCard;

