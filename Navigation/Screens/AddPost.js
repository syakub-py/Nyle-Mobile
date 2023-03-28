import * as React from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TextInput,Image ,Pressable, Dimensions, Picker, Alert } from 'react-native';
import faker from 'faker';
import {firestore, getstorage} from './Components/Firebase';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';


const {width} = Dimensions.get("window");
const height = width*1;

// const handleSubmit = async (title) =>{
//     const configuration = new Configuration({
//         apiKey: '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',
//     });
//     const openai = new OpenAIApi(configuration);
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: "I am selling a " + title +" write a short description" ,
//         max_tokens: 100
//     });

//     return response.data.choices[0].text;
// }

export default function AddPost({route}){
    faker.seed(20);

    const [refresh, setRefreshing] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [coordinates, setCoordinates] = React.useState({latitude: 0, longitude: 0,});
    const [imageUrls, setImageUrls] = React.useState([]);
    const [state, setState] = React.useState({active:0})

    let randomNumber = Math.floor(Math.random() * 100);

    const handleTitleChange = (title) => {
        setTitle(title);
    }

    const uploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
            const currentImageUrls = [...imageUrls];
            const fileJson = result.assets[0];
            currentImageUrls.push(fileJson.uri)
            setImageUrls(currentImageUrls);
            const filename = fileJson.uri.split('/')[fileJson.uri.split('/').length -1];
            const response = await fetch(fileJson.uri);
            const storageRef = getstorage.ref().child(`images/${filename}`);
            response.blob().then((result)=>{
                storageRef.put(result).then((snapshot) => {
                    console.log('Image uploaded successfully!');
                });
            })
        };
            
      };
          


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
            pic: imageUrls,
            profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${randomNumber}.jpg`,
            coordinates: coordinates,
            views: 0,
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
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {
                    imageUrls.map((item, index)=>(
                        <View key={index}>
                            <Image source={{uri:item}} style={{height:height, width:width, borderBottomRightRadius:10, borderBottomLeftRadius:10}}/>
                        </View>
                    ) )
                }
                </ScrollView>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{alignSelf:'center'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        {
                            imageUrls.map((i, k)=>(
                                <Pressable key={k}>
                                    <Image source={{uri:i}} style={k==state.active?{height:60, width:60, margin:10, borderRadius:10}:{height:50, width:50, margin:10, borderRadius:10, alignContent:'center'}} key={k}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>
            
                <Pressable onPress={uploadImage}>
                    <View style={{margin:10, backgroundColor:'black', height:50, borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:20}}>Tap to add pictures</Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=> {addPosts("AllPosts", title, price, details, description, coordinates)}}>
                    <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Add a post (for testing purposes only)</Text>
                    </View>
                </Pressable>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Title</Text>
                    <TextInput style={styles.textinput} onChangeText = {handleTitleChange} value={title}/>
                </View>



                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Price</Text>
                    <TextInput style={styles.textinput} onChangeText={(text)=>setPrice(text)}/>                    
                </View>

                <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Location</Text>
                <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
                    <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress={dropMarker}>
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