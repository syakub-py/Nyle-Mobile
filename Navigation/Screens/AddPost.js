import * as React from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView,TextInput, Pressable, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';
import {firestore} from './Components/Firebase';
import MapView, { Marker } from 'react-native-maps';
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
    const [coordinates, setCoordinates] = React.useState({latitude: 0, longitude: 0,});
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

    const addPosts = (collectionPath, title, coordinates) =>{
        if (!collectionPath) {
            throw new Error('Error: collection name cannot be empty');
        }
        return firestore.collection(collectionPath).doc(title).set({
            id:faker.random.number({min:1, max:100}),
            title: title,
            price: faker.random.number({min:1, max:100}),
            PostedBy: route.params.username,
            currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
            location: faker.address.state(),
            details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
            description: "On 2+ acres between the ocean and Georgica Pond on the most prestigious lane in East Hampton Village, this graceful 9 bedroom shingled classic has 160 feet directly on a white sandy beach plus a 3 bedroom guest house, private pool area, and dune-top sunset viewing deck. Beautifully maintained as an idyllic beach house by the same family for three generations, this timeless beauty is one of very few oceanfront properties on West End Road located almost entirely outside of the FEMA flood zone allowing for significant expansion.",
            pic:["https://photos.zillowstatic.com/fp/4e79c3f68954afcd7cea98e74330e230-uncropped_scaled_within_1536_1152.webp"],
            profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
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

                <Pressable>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Add Pictures</Text>
                    <View style={{backgroundColor:'lightgray', margin:20, borderRadius:15}}>
                        <Ionicons name = {'aperture-outline'} size={250} style={{alignSelf:'center', color:'gray'}}/>
                    </View>
                </Pressable>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Price</Text>
                    <TextInput style={styles.textinput}/>
                    
                </View>

                <View style={{width:width-50, height:300, alignSelf:'center', marginTop:20, marginBottom:20}}>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black'}}>Location</Text>
                    <MapView style={{height:"100%", width:"100%", borderRadius:30}} onLongPress={dropMarker}>
                        <Marker coordinate={coordinates}/>
                    </MapView>
                </View>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Details</Text>
                    <TextInput style={{backgroundColor:'lightgray',color:'gray',marginLeft:35,marginRight:35,fontSize:15,fontWeight:'600',height:200,borderRadius:10,paddingHorizontal:15,}}/>
                </View>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20,}}>Description</Text>
                    <TextInput style={{backgroundColor:'lightgray',color:'gray',marginLeft:35,marginRight:35,fontSize:15,fontWeight:'600',height:200,borderRadius:10,paddingHorizontal:15,}} defaultValue ={description}/>
                </View>

                <Pressable onPress={()=> {addPosts("AllPosts", title, coordinates)}}>
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