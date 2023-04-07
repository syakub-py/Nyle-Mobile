import faker from 'faker';
import { View, Text, SafeAreaView, Image, Dimensions, ScrollView, Pressable, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {firestore} from './Components/Firebase'
import MapView, { MAP_TYPES, Marker } from 'react-native-maps';

const {width} = Dimensions.get("window");
const height = width*0.7;

export default function EditPost({navigation, route}){
    const images = route.params.images
    const collectionPath= route.params.collectionPath
    const [state, setState] = React.useState({active:0})
    const [title, setTitle] = React.useState(route.params.PostTitle)
    const [price, setPrice] = React.useState(route.params.Price)
    const [details, setDetails] = React.useState(route.params.Details)
    const [description, setDescription] = React.useState(route.params.Description)

    const change = ({nativeEvent}) =>{
        const slide = Math.floor(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width);
        if(slide !== state.active){
            setState({active: slide})
        }
    }
    
    const saveChanges = (collectionPath, oldTitle, newTitle, price, description, details) => {
        if (!collectionPath) {
            throw new Error('Error: collection name cannot be empty');
        }
        return firestore.collection(collectionPath).doc(oldTitle).set({
            id:faker.random.number({min:1, max:100}),
            title: newTitle,
            price: price,
            currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
            location: faker.address.state(),
            details: details,
            description: description,
            pic:[ "https://photos.zillowstatic.com/fp/37e63bdbc4f81984c6aa3fa7cc704e54-uncropped_scaled_within_1536_1152.webp"],
            profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
            dateUpdated: new Date().toLocaleString(),
        })
        .then(ref => {
            console.log('Edited document with ID: ' + newTitle);
        })
        .catch(error => {
            console.log('Error Editing document: ', error);
        });
    }

    return (
        <SafeAreaView style={{flex:1}}>

            <View>
                <View style={{zIndex:1, flexDirection:'row'}}>
                    <View style={{position: 'absolute', top: 20, left: 20, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:70, opacity:0.8, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress={()=>navigation.goBack()}>
                            <Ionicons name='arrow-back-outline' size={30}/>
                        </Pressable>
                    </View>
                </View>
                
                <ScrollView>
                    <Ionicons name='create' color={'white'} size={40} style={{position: 'absolute', top: 20, right: 10, height:50, width:50, opacity:0.8}}/>
                    <View>
                        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={change}>
                            {
                                images.map((image, index)=>(
                                        <View style={{width, height, position: 'relative'}} key={index}>
                                            {/* onPress={()=>navigation.navigate("view image", {pics: images})} */}
                                            <Pressable >
                                                <Image style={{width, height, borderBottomLeftRadius:10, borderBottomRightRadius:10}} resizeMode = {'cover'} source={{uri:image}} key ={index}/>
                                            </Pressable>
                                        </View>
                                    )
                                )
                            }
                        </ScrollView>
                        <View style = {{flexDirection:'row', position:'absolute', bottom:0, alignSelf:'center', alignItems:'center'}}>
                            {
                                images.map((i, k)=>(
                                    <Text style={k==state.active?{color:'white', margin:4, fontSize:(width/25)}:{color:'#a8a5a5', margin:4, fontSize:(width/35)}} key={k}>⬤</Text>
                                ))
                            }
                        </View>
                    </View>

                    <TextInput style={{margin:15, fontSize:30, fontWeight:'bold', backgroundColor:'lightgray', borderRadius:10}} defaultValue={route.params.PostTitle} onChangeText={(text) => {setTitle(text)}}/>

                    <Text style={{color:'gray', fontSize:20, marginLeft:10, marginBottom:15}}><Ionicons name='location-outline' size={20} style={{marginRight: 10}}/>{route.params.Location}</Text>

                    <Text style={{color: '#a8a5a5', fontSize:17, fontWeight:'semi-bold', marginLeft:10, marginTop:10}}>Posted By: {faker.name.findName()}</Text>

                    <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
                        <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: route.params.coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} >
                            <Marker coordinate={route.params.coordinates}/>
                        </MapView>
                    </View>

                    <View>
                        <TextInput style={{fontSize:35, fontWeight:'bold', color:'black', margin:20, backgroundColor:'lightgray'}} defaultValue={route.params.Price} onChangeText={(text) => {setPrice(text)}}/> 
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                        <TextInput style={{marginRight:30, marginLeft:30, backgroundColor:'lightgray', fontSize:15, borderRadius:10, fontWeight:'200'}} defaultValue={route.params.Details} onChangeText={(text) => {setDetails(text)}} multiline={true} textAlignVertical='center'/>
                    </View>

                    <View style={{marginBottom:20}}>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                        <TextInput style={{marginRight:30, marginLeft:30, backgroundColor:'lightgray', fontSize:15, borderRadius:10, fontWeight:'200'}} defaultValue={route.params.Description} multiline={true} onChangeText={(text) => {setDescription(text)}}/>
                    </View>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                        <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:(width-20), height:50, alignItems:'center', margin:20}}>
                            <Pressable onPress={()=>{saveChanges(collectionPath, route.params.PostTitle, title, price, description, details)}}>
                                <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Save changes</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>
            
        </SafeAreaView>
    )
}