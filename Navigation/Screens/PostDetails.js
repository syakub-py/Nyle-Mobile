import {View, Text, Image, Dimensions, ScrollView, Pressable, Alert, SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import {firestore} from './Components/Firebase'
import {generateRating} from "./GlobalFunctions";

const {width} = Dimensions.get("window");
const height = width * 1;

/*
    @route.params = {Currency:url of the currency, CurrentUserProfilePic:current users profile picture, DatePosted:the date the post was posted, Description: description of the post, details: minor details of post, Likes: array of usernames that liked the post, PostTitle:the title of the post, images:array of urls of the images of the post, postedBy:the user that made the post, username:the current username, views: number of views}
*/

export default function PostDetails({route, navigation}){
    const images = route.params.images
    const [state, setState] = React.useState({active:0})
    const [more, setMore] = React.useState(false)
    const [liked,setLiked] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false);
    const [views, setViews] = React.useState(0)
    const [currentOffset, setCurrentOffset] = React.useState(0);
    const likes = route.params.Likes
    const scrollViewRef = React.useRef(null);
    const [rating, setRating] = React.useState(0)


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

    const handleAddChat = () => {
        if (route.params.username !== route.params.postedBy) {
            firestore
                .collection('Chats')
                .add({
                    owners: [
                        {
                            profilePic: route.params.CurrentUserProfilePic,
                            username: route.params.username,
                        },
                        {
                            profilePic: route.params.PostedByProfilePic,
                            username: route.params.postedBy,
                        },
                    ],
                })
                .then((ref) => {
                   const owners =  [
                        {
                            profilePic: route.params.CurrentUserProfilePic,
                            username: route.params.username,
                        },
                        {
                            profilePic: route.params.PostedByProfilePic,
                            username: route.params.postedBy,
                        },
                    ];

                    const username = owners[1].username
                    navigation.navigate("chat box", {username: route.params.username, conversationID:ref.id, name: username, avatar: owners[1].profilePic, otherAvatar:owners[0].profilePic, userId:findUser(owners)})
                })
                .catch((error) => {
                    Alert.alert('Error adding document: ', error);
                });
        }
    };

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
                            console.log('Liked!');
                        })
                        .catch((error) => {
                            console.error('Error adding Like:', error);
                        });
                } else {
                    const likesArray = doc.data().likes || [];
                    const updatedLikesArray = likesArray.filter((username) => username !== route.params.username);
                    PostRef.update({ likes: updatedLikesArray })
                        .then(() => {
                            console.log('Like removed');
                        })
                        .catch((error) => {
                            console.error('Error removing like:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
    };


    const change = ({ nativeEvent }) => {
        const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        const newOffset = nativeEvent.contentOffset.x;
        setCurrentOffset(newOffset);

        setState({ active: slide });
        if (slide <= images.length-4) {
            scrollViewRef.current.scrollTo({
                x: 0,
                animated: true,
            });
        }

        if (slide >= 6) {
            setCurrentOffset(currentOffset + 10);
            scrollViewRef.current.scrollTo({
                x: currentOffset,
                animated: true,
            });
        }
    };

    const findUser = (userArray)=>{
        for (let index = 0; index < userArray.length; index++) {
            if (userArray[index].username!==route.params.username){
                return index
            }
        }
        return "";
    }


    React.useEffect(()=>{
        handleViewCounter();
        generateRating(route.params.postedBy).then((result)=>{
            setRating(result)
        })
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

                    <View style={{ height: 20, maxWidth: 60,zIndex: 1, bottom: 10, right: 10, paddingHorizontal:5, position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems:'center'}}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{state.active + 1}/{images.length}</Text>
                    </View>

                    <View style={{zIndex: 1, bottom: 15, left: 20, position: 'absolute', backgroundColor:'transparent', borderRadius: 4, alignItems:'center', flexDirection:"row"}}>
                        <Image style={{height:25, width:25, marginRight:10, borderRadius:20}} resizeMode={'cover'} source={{uri:route.params.Currency}}/>
                        <Text style={{fontSize:25, fontWeight:'bold', color:'white', marginRight:10}}>{route.params.Price}</Text>
                        <Text style={{fontSize:15, fontWeight:'bold', color:'white'}}>(${route.params.USD})</Text>
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

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{alignSelf:'center'}}  ref={scrollViewRef}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        {
                            images.map((i, k)=>(
                                <Pressable key={k} onPress={()=> {console.log(k+1)}}>
                                    <Image source={{uri:i}} style={k==state.active?{height:60, width:60, margin:7, borderRadius:10}:{height:50, width:50, margin:7, borderRadius:10, alignContent:'center'}} key={k}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>

                {
                    (route.params.postedBy !== route.params.username)?(
                        <View style={{flexDirection:"row", justifyContent:'space-between'}}>
                            <View style={{justifyContent:'center', flexDirection:'row', margin:10}}>
                                <Image source={{uri:route.params.PostedByProfilePic}} style={{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                                <View style={{margin:10,alignSelf:'center'}}>
                                    <Text style={{fontWeight:'bold', color:'black', }}>{route.params.postedBy}</Text>
                                    <Text style={{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                                    <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'whitesmoke', width:45, borderRadius:10, marginTop:3}}>
                                        <Ionicons name={'star'} style={{margin:3}} color={"#ebd61e"} size={13}/>
                                        <Text style={{fontSize:12, fontWeight:'bold'}}>{rating.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </View>

                            <Pressable onPress={handleAddChat}>
                                <View style={{height:60, width:60, borderRadius:15, backgroundColor:'#292929', elevation:10, margin:10}}>
                                    <Ionicons name="chatbox-ellipses-outline" color={'white'} size={30} style={{margin:15}}/>
                                </View>
                            </Pressable>

                        </View>
                    ):(
                        <View style={{flexDirection:"row", justifyContent:'space-between'}}>
                            <View style={{justifyContent:'center', flexDirection:'row', margin:10}}>
                                <Image source={{uri:route.params.PostedByProfilePic}} style={{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                                <View style={{margin:10,alignSelf:'center'}}>
                                    <Text style={{fontWeight:'bold', color:'black', }}>{route.params.postedBy} (You)</Text>
                                    <Text style={{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                                    <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'whitesmoke', width:45, borderRadius:10, marginTop:3}}>
                                        <Ionicons name={'star'} style={{margin:3}} color={"#ebd61e"} size={13}/>
                                        <Text style={{fontSize:12, fontWeight:'bold'}}>{rating.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    )
                }

                    

                    <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Location</Text>
                    <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden', elevation:3}}>
                        <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: route.params.coordinates, pitch: 0,heading:0,zoom: 12, altitude:0}} >
                            <Marker coordinate={route.params.coordinates}/>
                            <Circle
                                center={route.params.coordinates}
                                radius={1200}
                                fillColor="rgba(255, 0, 0, 0.2)"
                                strokeColor="rgba(255, 0, 0, 0.7)"
                                strokeWidth={1}
                            />
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
            {/*<View style={{flexDirection:'row', position: 'absolute', bottom: 0, height:'10%', width:'100%', justifyContent:'space-evenly', backgroundColor:'transparent', alignItems:'center'}}>*/}
            {/*    <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>*/}
            {/*        <Pressable>*/}
            {/*            <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Place Bid</Text>*/}
            {/*        </Pressable>*/}
            {/*    </View>*/}

            {/*    <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>*/}
            {/*        <Pressable onPress={()=> navigation.navigate("Check Out", {title: route.params.PostTitle, price:route.params.Price, currency: route.params.Currency})}>*/}
            {/*            <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Buy out</Text>*/}
            {/*        </Pressable>*/}
            {/*    </View>*/}
            {/*</View>*/}
        </SafeAreaView>
    )
}