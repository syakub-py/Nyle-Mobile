import faker from 'faker';
import { View, Text, Image, Dimensions, ScrollView, Pressable, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import {firestore} from './Components/Firebase'


const {width} = Dimensions.get("window");
const height = width*1;

export default function PostDetails({route, navigation}){

    const images = route.params.images
    const [state, setState] = React.useState({active:0})

    const handleAddChat = () =>{
        firestore.collection('Chats').add({
          owners:[
            {
                profilePic:"",
                username: route.params.username
            },
            {
                profilePic:route.params.ProfilePic,
                username: route.params.postedBy
            }
        ]
        })
        .then(ref => {
          Alert.alert("Added")
        })
        .catch(error => {
            Alert.alert('Error adding document: ', error);
        });
    }

    const change = ({nativeEvent}) =>{
        const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
        if(slide !== state.active){
            setState({active: slide})
        }
    }

    return (
        <View style={{flex:1}}>
            <ScrollView style={{backgroundColor:'white'}} showsVerticalScrollIndicator = {false}>
                <View style={{zIndex:1}}>
                    <Avatar size={55} rounded source={{uri: route.params.ProfilePic}} containerStyle={{ position: 'absolute', top: 20, right: 20, elevation:5}}/>
                    <View style={{position: 'absolute', top: 20, left: 20, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:70, opacity:0.8, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress={()=>navigation.goBack()}>
                            <Ionicons name='arrow-back-outline' size={30}/>
                        </Pressable>
                    </View>
                </View>

                <View>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={change}>
                        {
                            images.map((image, key)=>(
                                <Pressable onPress={()=>{navigation.navigate("Image Viewer", {pictures:images, index: key})}} key={key}>
                                    <View style={{width, height, position: 'relative'}} >
                                        <Image style={{width, height, borderBottomLeftRadius:10, borderBottomRightRadius:10}} resizeMode = {'cover'} source={{uri:image}} key ={key}/>
                                        <View style={{height:20, width:25,zIndex:1,bottom:10,left:10, position:'absolute'}}>
                                            <Text style={{color:"white", fontWeight:'bold'}}>{key+1}/{images.length}</Text>
                                        </View>
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
                                    <Image source={{uri:i}} style={k==state.active?{height:60, width:60, margin:10, borderRadius:10}:{height:50, width:50, margin:10, borderRadius:10, alignContent:'center'}} key={k}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>

                    <View style={{flexDirection:"row", justifyContent:'space-between'}}>
                        <Text style={{marginTop:10, marginBottom:10, marginLeft:15, fontSize:30, fontWeight:'bold'}}>{route.params.PostTitle}</Text>
                        <Pressable onPress={handleAddChat}>
                            <View style={{height:60, width:60, borderRadius:100, backgroundColor:'black', elevation:10, margin:10}}>
                                <Ionicons name="chatbox" color={'white'} size={30} style={{margin:15}}/>
                            </View>
                        </Pressable>
                    </View>

                    <View>
                        <Text style={{color: '#a8a5a5', fontSize:17, fontWeight:'semi-bold', marginLeft:10, marginTop:10}}>This post has {route.params.views} views</Text>
                        <Text style={{color: '#a8a5a5', fontSize:17, fontWeight:'semi-bold', marginLeft:10, marginTop:10}}>Posted By: {route.params.postedBy}</Text>
                    </View>
                    
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{height:30, width:30, margin:10, borderRadius:20}} resizeMode={'cover'} source={{uri:route.params.Currency}}/>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black'}}>{route.params.Price}</Text>
                    </View>


                    <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Location</Text>
                    <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
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
                        <Text style={{marginRight:30, marginLeft:30, color:'#a8a5a5', fontSize:15}}>{route.params.Description}</Text>
                    </View>

                <Text style={{color:'#a8a5a5', margin:10,fontSize:17, fontWeight:'semi-bold', alignSelf:'center'}}>Posted On: {route.params.DatePosted}</Text>

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
        </View>
    )
}