import { View, Text, SafeAreaView, Image, Dimensions, ScrollView, Pressable, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useRef} from 'react';
import {firestore} from './Components/Firebase'
import MapView, {Circle, Marker} from 'react-native-maps';

const {width} = Dimensions.get("window");
const height = width*0.7;

export default function EditPost({navigation, route}) {
    const images = route.params.images
    const collectionPath= route.params.collectionPath
    const [state, setState] = useState({active:0})
    const [title, setTitle] = useState(route.params.PostTitle)
    const [price, setPrice] = useState(route.params.Price)
    const [details, setDetails] = useState(route.params.Details)
    const [description, setDescription] = useState(route.params.Description)
    const scrollViewRef = useRef(null);

    const change = ({nativeEvent}) => {
        const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
        if (slide !== state.active) setState({active: slide})
    }
    
    // const saveChanges = (collectionPath, oldTitle, newTitle, price, description, details) => {
    //     if (!collectionPath) throw new Error('Error: collection name cannot be empty');
    //     
    //     return firestore.collection(collectionPath).doc(oldTitle).set({
    //         id:faker.random.number({min:1, max:100}),
    //         title: newTitle,
    //         price: price,
    //         currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
    //         location: faker.address.state(),
    //         details: details,
    //         description: description,
    //         pic:[ "https://photos.zillowstatic.com/fp/37e63bdbc4f81984c6aa3fa7cc704e54-uncropped_scaled_within_1536_1152.webp"],
    //         profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
    //         dateUpdated: new Date().toLocaleString(),
    //     })
    //     .then(ref => {
    //         console.log('Edited document with ID: ' + newTitle);
    //     })
    //     .catch(error => {
    //         console.log('Error Editing document: ', error);
    //     });
    // }

    return (
        <SafeAreaView style = {{flex:1}}>
            <ScrollView style = {{backgroundColor:'white'}} showsVerticalScrollIndicator = {false}>
                <View style = {{zIndex:1}}>
                    <View style = {{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress= {() =>navigation.goBack()}>
                            <Ionicons name ='chevron-back-outline' size = {30}/>
                        </Pressable>
                    </View>

                </View>

                <View>
                    <View style = {{zIndex: 1, bottom: 50, left: 20, position: 'absolute', backgroundColor:'transparent', borderRadius: 4, alignItems:'center'}}>
                        <TextInput style = {{color:'white',fontSize:30,fontWeight:'bold'}} defaultValue = {route.params.PostTitle} onChangeText= {(text) => {setTitle(text)}}/>
                    </View>

                    <View style = {{ height: 20, maxWidth: 60,zIndex: 1, bottom: 10, right: 10, paddingHorizontal:5, position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems:'center'}}>
                        <Text style = {{ color: 'white', fontWeight: 'bold' }}>{state.active + 1}/{images.length}</Text>
                    </View>

                    <View style = {{zIndex: 1, bottom: 15, left: 20, position: 'absolute', backgroundColor:'transparent', borderRadius: 4, alignItems:'center', flexDirection:"row"}}>
                        <Image style = {{height:25, width:25, marginRight:10, borderRadius:20}} resizeMode = {'cover'} source = {{uri:route.params.Currency}}/>
                        <TextInput style = {{color:'white',fontSize:25,fontWeight:'bold'}} defaultValue = {route.params.Price} onChangeText= {(text) => {setPrice(text)}}/>
                        <Text style = {{fontSize:15, fontWeight:'bold', color:'white'}}>(${route.params.USD})</Text>
                    </View>


                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator= {false} onScroll= {change}>
                        {
                            images.map((image, key) =>(
                                    <Pressable onPress= {() => {navigation.navigate("Image Viewer", {pictures:images, index: key})}} key= {key}>
                                        <View style = {{width, height, position: 'relative'}} >
                                            <Image style = {{width, height}} resizeMode = {'cover'} source = {{uri:image}} key = {key}/>
                                        </View>
                                    </Pressable>
                                )
                            )
                        }
                    </ScrollView>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator= {false} style = {{alignSelf:'center'}}  ref= {scrollViewRef}>
                    <View style = {{flexDirection:'row', alignItems:'center'}}>
                        {
                            images.map((i, k) =>(
                                <Pressable key= {k} onPress= {() => {console.log(k+1)}}>
                                    <Image source = {{uri:i}} style = {k==state.active?{height:60, width:60, margin:7, borderRadius:10}:{height:50, width:50, margin:7, borderRadius:10, alignContent:'center'}} key= {k}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>



                <Text style = {{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Location</Text>
                <View style = {{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden', elevation:3}}>
                    <MapView style = {{height:"100%", width:"100%"}} initialCamera= {{center: route.params.coordinates, pitch: 0,heading:0,zoom: 12, altitude:0}} >
                        <Marker coordinate = {route.params.coordinates}/>
                        <Circle
                            center= {route.params.coordinates}
                            radius= {1200}
                            fillColor= "rgba(255, 0, 0, 0.2)"
                            strokeColor= "rgba(255, 0, 0, 0.7)"
                            strokeWidth= {1}
                        />
                    </MapView>
                </View>

                <View style = {{marginBottom:20}}>
                    <Text style = {{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                    <TextInput style = {{marginRight:30, marginLeft:30, color:'#a8a5a5', fontSize:15}} defaultValue = {route.params.Details} onChangeText= {(text) =>setDetails(text)}/>
                </View>

                <View style = {{marginBottom:20}}>
                    <Text style = {{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                    <TextInput style = {{marginRight:30, marginLeft:30, color:'#a8a5a5', fontSize:15}} defaultValue = {route.params.Description} onChangeText= {(text) =>setDescription(text)}/>
                </View>

                <Text style = {{color:'#a8a5a5', margin:10,fontSize:17, fontWeight:'semi-bold', alignSelf:'center'}}>{route.params.DatePosted}</Text>

            </ScrollView>
        </SafeAreaView>
    )
}
