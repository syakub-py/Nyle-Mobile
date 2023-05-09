import {View, Text, Image, Dimensions, ScrollView, Pressable, Alert, SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import {firestore} from './Components/Firebase'

const {width} = Dimensions.get("window");
const height = width * 1;

export default function PostDetails({route, navigation}){
    const images = route.params.images
    const [state, setState] = React.useState({active:0})
    const [more, setMore] = React.useState(false)
    const [liked,setLiked] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false);
    const [views, setViews] = React.useState(0)
    const likes = route.params.Likes

    const handleViewCounter = () => {
        const PostRef = firestore.collection('AllPosts').doc(route.params.PostTitle);
        PostRef.get()
            .then((doc) => {
                const currentViews = doc.data().views;
                setViews(currentViews + 1);
                PostRef.update({ views: currentViews + 1 })
                    .then(() => {
                        console.log('Views incremented');
                    })
                    .catch((error) => {
                        console.error('Error adding value to views:', error);
                    });
            });
    };

    const handleAddChat = () =>{
        if (route.params.username!==route.params.postedBy) {
            firestore.collection('Chats').add({
                owners: [
                    {
                        profilePic: route.params.CurrentUserProfilePic,
                        username: route.params.username
                    },
                    {
                        profilePic: route.params.PostedByProfilePic,
                        username: route.params.postedBy
                    }
                ]
            }).then(ref => {
                    Alert.alert("Added")
                }).catch(error => {
                    Alert.alert('Error adding document: ', error);
                });
        }
    }

    const handleLike = async () => {
        const PostRef = firestore.collection('AllPosts').doc(route.params.PostTitle);
        setLiked(!liked)
        PostRef.get()
            .then((doc) => {
                if (doc.exists && !doc.data().likes.includes(route.params.username)) {
                    const likesArray = doc.data().likes || [];
                    // Modify the array as needed
                    likesArray.push(route.params.username);
                    // Write the updated array back to the document
                    PostRef.update({ likes: likesArray })
                        .then(() => {
                            console.log('Value added to array');
                        })
                        .catch((error) => {
                            console.error('Error adding value to array:', error);
                        });
                } else {
                    const likesArray = doc.data().likes || [];
                    const updatedLikesArray = likesArray.filter((username) => username !== route.params.username);
                    PostRef.update({ likes: updatedLikesArray })
                        .then(() => {
                            console.log('Value removed from array');
                        })
                        .catch((error) => {
                            console.error('Error updating array:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
    };


    const change = ({nativeEvent}) =>{
        const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
        if(slide !== state.active){
            setState({active: slide})
        }
    }

    React.useEffect(()=>{
        handleViewCounter()
    }, [])

    return (
        <SafeAreaView style={{flex:1}}>
            <ScrollView style={{backgroundColor:'white'}} showsVerticalScrollIndicator = {false}>
                <View style={{zIndex:1}}>
                    <View style={{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress={()=>navigation.goBack()}>
                            <Ionicons name='chevron-back-outline' size={30}/>
                        </Pressable>
                    </View>

                    <View style={{position: 'absolute', top: 30, right: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress={() => setIsOpen(!isOpen)}>
                            <Ionicons name='reorder-three-outline' size={30}/>
                        </Pressable>
                    </View>

                    <View style={{position: 'absolute', top: 30, right: 75, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress={()=>handleLike()}>
                            {
                                (liked || likes.includes(route.params.username))?(
                                    <Ionicons name='heart' size={30} color={'#e6121d'}/>

                                ):(
                                    <Ionicons name='heart-outline' size={30}/>
                                )
                            }
                        </Pressable>
                    </View>

                </View>

                <View>
                    <View style={{zIndex: 1, bottom: 50, left: 20, position: 'absolute', backgroundColor:'transparent', borderRadius: 4, alignItems:'center'}}>
                         <Text style={{color:'white',fontSize:30,fontWeight:'bold'}}>{route.params.PostTitle}</Text>
                    </View>

                    <View style={{ height: 20, width: 35, zIndex: 1, bottom: 10, right: 10, position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems:'center'}}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{state.active + 1}/{images.length}</Text>
                    </View>

                    <View style={{zIndex: 1, bottom: 15, left: 20, position: 'absolute', backgroundColor:'transparent', borderRadius: 4, alignItems:'center', flexDirection:"row"}}>
                        <Image style={{height:25, width:25, marginRight:10, borderRadius:20}} resizeMode={'cover'} source={{uri:route.params.Currency}}/>
                        <Text style={{fontSize:25, fontWeight:'bold', color:'white', marginRight:10}}>{route.params.Price}</Text>
                        <Text style={{fontSize:15, fontWeight:'bold', color:'white'}}>(${(route.params.USD).toLocaleString()})</Text>
                    </View>

                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={change}>
                        {
                            images.map((image, key)=>(
                                <Pressable onPress={()=>{navigation.navigate("Image Viewer", {pictures:images, index: key})}} key={key}>
                                    <View style={{width, height, position: 'relative'}} >
                                        <Image style={{width, height}} resizeMode = {'cover'} source={{uri:image}} key ={key}/>
                                    </View>
                                </Pressable>
                                )
                            )
                        }
                    </ScrollView>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{alignSelf:'center'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        {
                            images.map((i, k)=>(
                                <Pressable key={k} onPress={()=>console.log("Button Pressed")}>
                                    <Image source={{uri:i}} style={k==state.active?{height:60, width:60, margin:7, borderRadius:10}:{height:50, width:50, margin:7, borderRadius:10, alignContent:'center'}} key={k}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>

                    <View style={{flexDirection:"row", justifyContent:'space-between'}}>
                        <View style={{justifyContent:'center', flexDirection:'row', paddingHorizontal:10, margin:10}}>
                            <Image source={{uri:route.params.PostedByProfilePic}} style={{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                            <View style={{margin:10,alignSelf:'center'}}>
                                <Text style={{fontWeight:'bold', color:'black', }}>{route.params.postedBy}</Text>
                                <Text style={{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                            </View>
                        </View>


                        <Pressable onPress={handleAddChat}>
                            <View style={{height:60, width:60, borderRadius:15, backgroundColor:'#292929', elevation:10, margin:10}}>
                                <Ionicons name="chatbubble-ellipses-outline" color={'white'} size={30} style={{margin:15}}/>
                            </View>
                        </Pressable>
                    </View>
                    

                    <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Location</Text>
                    <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden', elevation:3}}>
                        <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: route.params.coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} >
                            <Marker coordinate={route.params.coordinates}/>
                        </MapView>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'#a8a5a5', fontSize:15}}>{route.params.Details}</Text>
                    </View>

                    <View style={{marginBottom:20}}>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'#a8a5a5', fontSize:15}} onPress={()=>setMore(true)}>{more ? route.params.Description : route.params.Description.slice(0, 500) + " ..."}</Text>
                    </View>

                <Text style={{color:'#a8a5a5', margin:10,fontSize:17, fontWeight:'semi-bold', alignSelf:'center'}}>{route.params.DatePosted}</Text>

            </ScrollView>
            {/* <View style={{flexDirection:'row', position: 'absolute', bottom: 0, height:'10%', width:'100%', justifyContent:'space-evenly', backgroundColor:'transparent', alignItems:'center'}}>
                <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>
                    <Pressable>
                        <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Place Bid</Text>
                    </Pressable>
                </View>

                <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>
                    <Pressable onPress={()=> navigation.navigate("Check Out", {title: route.params.PostTitle, price:route.params.Price, currency: route.params.Currency})}>
                        <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Buy out</Text>
                    </Pressable>
                </View>
            </View>  */}
        </SafeAreaView>
    )
}