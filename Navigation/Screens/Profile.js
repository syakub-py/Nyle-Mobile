import * as React from 'react';
import { View, Text, StyleSheet,Alert, ScrollView, Image, TouchableOpacity, Pressable, RefreshControl} from 'react-native';
import faker from 'faker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from './Components/PostCard.js';
import { SwipeListView } from 'react-native-swipe-list-view';
import {firestore, getstorage} from './Components/Firebase'
import firebase from "firebase/compat/app";


const SectionTitle = ({title}) => {
  return(
    <View style = {{marginTop: 20, marginLeft:10}}>
      <Text style={{color: 'gray', fontSize:30, fontWeight:'bold'}}>{title}</Text>
    </View>)
    }

const Setting = ({title, nameOfIcon,type, onPress}) => {
  if (type == "button"){
    return(
      <TouchableOpacity style = {{flexDirection: 'row', height:50, alignItems:'center', width:'100%', marginLeft:20}} onPress = {onPress}>
        <View style={{flexDirection:'row'}}>
          <Ionicons name={nameOfIcon} style={{color:'black', marginRight: 20}} size={25}/>
          <Text style = {{flex:1, color:'black', fontSize: 16, fontWeight:'bold'}}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }else{
    return(
      <View></View>
    )
  }
}




export default function Profile({navigation, route}) {
  const [userList, setUserList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getPosts = async () =>{
    const results = [];
    const MyPostsQuery =  firestore.collection('AllPosts').where("PostedBy", "==", route.params.username)
    await MyPostsQuery.get().then(postSnapshot =>{
      postSnapshot.forEach(doc => {
            results.push(doc.data())
        });
      })
    return results;
  }

  
const transactions =[
  {
    title: faker.address.streetAddress(),
    price: "560",
    currency: "https://www.pngall.com/wp-content/uploads/10/Solana-Crypto-Logo-PNG-File.png",
    location: faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
  },
  {
    title: faker.address.streetAddress(),
    price: "50",
    currency: "https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png",
    location:faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/8134820/pexels-photo-8134820.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
  },
  {
    title: faker.address.streetAddress(),
    price: "50",
    currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
    location: faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/7598365/pexels-photo-7598365.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
  },
  {
    title: faker.address.streetAddress(),
    price: "10",
    currency: "https://seeklogo.com/images/D/dogecoin-doge-logo-625F9D262A-seeklogo.com.png?v=637919377460000000",
    location: faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
},
]

  const onRefresh = () => {
    setRefreshing(true);
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      Alert.alert('Error Getting Posts: ', error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSignOut = async () =>{
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
    return navigation.navigate("Login")
  }
  
  React.useEffect(()=>{
    getPosts().then((result) =>{
      const userPostList = result
      setUserList(userPostList);
    }).catch((error)=>{
      Alert.alert('Error Getting Posts: ', error)
    })
  }, [])

  const deletePost = (item) => {
    console.log("Deleting post:", item.title);
    firestore
        .collection("AllPosts")
        .doc(item.title)
        .delete()
        .then(() => {
          console.log("Deleted the Firestore data");
          //delete each image
          item.pic.forEach((picture, index) => {
            const picRef = getstorage.refFromURL(picture);
            console.log("Deleting image:", picture);
            picRef
                .delete()
                .then(() => {
                  console.log("Deleted picture");
                })
                .catch((error) => {
                  console.log("Error deleting picture:", error);
                });
          });
          Alert.alert("Posted deleted!");
          onRefresh();
        })
        .catch((error) => {
          console.log("Error deleting document: " + JSON.stringify(error));
        });
  };

  return (
      <View >
            <SwipeListView
              data={userList}
              rightOpenValue={-110}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent= {
                <View>
                  <Text style={{color:'black', paddingTop:20, paddingLeft:30, fontSize:30, fontWeight:'bold'}}>Settings</Text>
                  <View style = {{alignSelf:"flex-start", flexDirection:'row',  width:'100%', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                        <Image source = {{uri:`https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,}} style = {styles.image} resizeMode ="cover"/>
                        <Text style = {{color:'black',alignSelf:"center",fontSize:20, fontWeight:'bold'}}>{route.params.username}</Text>
                  </View>

                    <SectionTitle
                    title = 'Account Settings'
                    />

                    <Setting
                      title = "Security"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = 'lock-closed-outline'
                    />

                    <Setting
                      title = "Appearance"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = 'eye-outline'
                    />

                    <Setting
                      title = "Connect a wallet"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon = "wallet-outline"
                    />

                    <Setting
                      title = "2 factor Authentication"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon='settings-outline'

                    />

                    <Setting
                      title = "Edit Profile"
                      type = "button"
                      onPress = {() => console.log("pressed button")}
                      nameOfIcon='person-outline'

                    />
                            
                    <Setting
                      title = "Log Out"
                      type = "button"
                      onPress = {handleSignOut}
                      nameOfIcon = 'log-out-outline'
                    />
                  
                  <SectionTitle title={'Your Posts'}/>
                </View>
                }
              renderItem={({item}) => (
                <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, coordinates:item.coordinates})}>
                  <PostCard data ={item}/>
                </Pressable>
                )}
                renderHiddenItem = {({item}) => (
                  <View style={{ position: 'absolute',
                  flexDirection:'row',
                  top: 0,
                  right: 10,
                  bottom: 0,
                  width: 100,
                  alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>deletePost(item)} style={{marginRight:20}}>
                      <Ionicons size={30} name='trash-outline' color={"red"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("Edit Post", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, collectionPath:"AllPosts"})}>
                      <Ionicons size={30} name='create-outline' color={"Black"}/>
                    </TouchableOpacity>
                  </View>
               )
              }
            /> 
      </View>
      
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    image:{
      width: 100,
      height: 100,
      borderRadius: 100,
      overflow: 'hidden',
      paddingBottom: 50,
      margin:30
    },

  });


//   <View style={{marginTop:20}}>
//   <Text style ={{color: 'black', fontSize:18, fontWeight:'bold'}}>Recent Transactions</Text>
//   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//     {
//       transactions.map((item, index) =>(
//         <View style={{height:150, width:150, margin:10, shadowColor:'black',elevation:3}} key={index}>
//           <ImageBackground source={{uri:item.pic}}  imageStyle={{height:150, width:"100%",borderRadius:20}} resizeMode={'cover'}>
//             <View style={{flexDirection:'row', paddingHorizontal:5, paddingTop:3}}>
//               <Avatar source={{uri: item.profilePic}} rounded/>
//               <Text style={{color:'white', fontWeight:'bold', paddingHorizontal:10, paddingTop:5}}>{item.title}</Text>
//             </View>
//             <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:10}}>
//               <Image style={{height:15, width:15, marginRight:3, marginLeft:3}} source={{uri:item.currency}}/>
//               <Text style={{color:'white',}}>{item.price}</Text>
//             </View>
//           </ImageBackground>
//         </View>
//       ))
//     }
//   </ScrollView>
// </View>