import * as React from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView,TextInput, Pressable, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import faker from 'faker';
import {firestore} from './Components/Firebase';
import MapView, { MAP_TYPES, Marker } from 'react-native-maps';
const { Configuration, OpenAIApi } = require("openai");

const {width} = Dimensions.get("window");
const height = width*1;


const handleSubmit = async (title) =>{
    const configuration = new Configuration({
        apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "I am selling a " + title +" write a short description" ,
        max_tokens: 100
    });

    return response.data.choices[0].text;
}

export default function AddPost({route}){
    faker.seed(20);

    const [refresh, setRefreshing] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [coordinates, setCoordinates] = React.useState({latitude: 0, longitude: 0,});
    const [Images, setImages] = React.useState([]);

    let randomNumber = Math.floor(Math.random() * 100);

    const handleTitleChange = (title) => {
        setTitle(title);
    }

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const dropMarker = (event) =>{
        const coordinate = event.nativeEvent;
        
        setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
    } 

    const addPosts = (collectionPath, title, price, details, description, coordinates) =>{
        if (!collectionPath) {
            throw new Error('Error: collection name cannot be empty');
        }
        return firestore.collection(collectionPath).doc(title).set({
            id:randomNumber,
            title: title,
            price: price,
            PostedBy: route.params.username,
            currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
            details: details,
            description: description,
            pic:["https://photos.zillowstatic.com/fp/ba790d95e6afc01e83f94491000368e3-uncropped_scaled_within_1536_1152.webp"],
            profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${randomNumber}.jpg`,
            coordinates: coordinates,
            date: new Date().toLocaleString(),
        })
        .then(ref => {
            console.log('Added document with ID: ' + title);
        })
        .catch(error => {
            console.log('Error adding document: ', error);
        });
    }


    return(
        <View style={{backgroundColor:'white'}}>
            <ScrollView refreshControl={<RefreshControl refreshing ={refresh} onRefresh={onRefresh}/>} >

                <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100, marginLeft:20}}/>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Title</Text>
                    <TextInput style={styles.textinput} onChangeText = {handleTitleChange} value={title}/>
                </View>


                <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Add Pictures</Text>
                <TextInput  onChangeText={(text)=>{}} style={styles.textinput}/>

                <Pressable onPress={()=> {}}>
                    <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Add Picture</Text>
                    </View>
                </Pressable>
                {/* {console.log(Images)}
                {setImages(Images.concat(text))} */}
                

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Price</Text>
                    <TextInput style={styles.textinput} on onChangeText={(text)=>setPrice(text)}/>                    
                </View>

                <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Location</Text>
                <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
                    {/* mapType={MAP_TYPES.SATELLITE} */}
                    <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress={dropMarker} >
                        <Marker coordinate={coordinates}/>
                    </MapView>
                </View>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Details</Text>
                    <TextInput style={{backgroundColor:'lightgray', color:'gray', marginLeft:35, marginRight:35, fontSize:15,fontWeight:'600',height:200,borderRadius:10,paddingHorizontal:15,}} onChangeText={(text)=>setDetails(text)}/>
                </View>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20,}}>Description</Text>
                    <TextInput style={{backgroundColor:'lightgray', color:'gray', marginLeft:35, marginRight:35, fontSize:15, fontWeight:'600', height:200,borderRadius:10,paddingHorizontal:15,}} defaultValue ={description} onChangeText={(text)=>setDescription(text)}/>
                </View>

                <Pressable onPress={()=> {addPosts("AllPosts", title, price, details, description, coordinates)}}>
                    <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Add a post (for testing purposes only)</Text>
                    </View>
                </Pressable>

                {/* onPress={()=>{handleSubmit(title).then((result) => {setDescription(result)})}} */}
                <Pressable >
                    <View style={{backgroundColor:'black', borderRadius:20, alignItems:'center', margin:10}}>
                        <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Generate Description</Text>
                    </View>
                </Pressable>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    textinput:{
        backgroundColor:'lightgray',
        color:'gray',
        marginLeft:35,
        marginRight:35,
        fontSize:15,
        fontWeight:'600',
        height:50,
        borderRadius:10,
        paddingHorizontal:15,
    },
  });