import {Text, View, Image, ImageBackground, Pressable, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {firestore} from "./Firebase";

export default function PostCard({data}){
  const navigation = useNavigation();
  const [iconName, setIconName] = React.useState('heart-outline');
  const [liked,setLiked] = React.useState(false)

  const handleLike = async () => {
    const PostRef = firestore.collection('AllPosts').doc(data.title);
    setLiked(true)
    PostRef.get()
        .then((doc) => {
          if (doc.exists && !doc.data().likes.includes(data.PostedBy)) {
            const likesArray = doc.data().likes || [];
            // Modify the array as needed
            likesArray.push(data.PostedBy);
            // Write the updated array back to the document
            PostRef.update({ likes: likesArray })
                .then(() => {
                  console.log('Value added to array');
                })
                .catch((error) => {
                  console.error('Error adding value to array:', error);
                });
          } else {
            console.error('Document does not exist');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
  };
  return (
    <View style = {{ backgroundColor: 'white', marginBottom: 10, margin: 20, borderRadius:10, elevation:3}}>
      <View style ={{width:"100%", height:300}}>
        <ImageBackground source={{uri: data.pic[0]}} imageStyle ={{width:"100%", height:300, borderRadius:10, resizeMode:'cover'}}>
          <View style={{position:'absolute', right:10,top:10, backgroundColor:'white', height:40, width:40, borderRadius:12, justifyContent:'center', alignItems:'center', opacity:0.7}}>
              <Pressable onPress={()=>handleLike()}>
                  {
                      (liked || data.likes.includes(data.PostedBy))?(
                          <Ionicons name='heart' size={25} color={'#e6121d'}/>

                      ):(
                          <Ionicons name='heart-outline' size={25}/>
                      )
                  }
              </Pressable>
          </View>

          {/*needs to get finished*/}
          {
            (data.sold === "true")? (<View style={{ position: 'absolute', top:250, right: 0, backgroundColor: 'red', height: 30, width: 70, transform: [{ rotate: '-45deg' }],  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>SOLD</Text>
          </View>):(<View></View>)
          }

            <View style={{flexDirection:'row'}}>
              <Pressable onPress={() => navigation.navigate("view profile", {ProfileImage: data.profilePic, username:data.PostedBy})}>
                <Image style={{height:50, width:50, borderRadius:15, elevation:10, margin:12}} source={{uri:data.profilePic, elevation:2}}/>
              </Pressable>

              <View>
                <Text style ={{fontSize:15, fontWeight:'bold', color:'white', elevation:1, paddingTop:5}}>{data.title}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Image style={{height:20, width:20, marginTop:4, borderRadius:20}} source={{uri:data.currency}}/>
                  <Text style={{color:'white', fontSize:15, elevation:1, margin:5, fontWeight:'500'}}>{data.price} </Text>

                </View>
              </View>
            </View>
          </ImageBackground>
      </View>
    </View>
  )
}

