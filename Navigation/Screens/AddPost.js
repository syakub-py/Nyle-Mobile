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
    const [image, setImage] = React.useState([]);
    const [imageUrls, setImageUrls] = React.useState([]);

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
            setImage(result.assets[0].uri);
            const ref = getstorage.ref().child('images').child(title + randomNumber);
            const response = await fetch(result.assets[0].uri);
            const data = await response.blob();
            const reader = new FileReader();
            reader.onload = async () => {
                const dataURL = reader.result;
                const contentType = dataURL && dataURL.match(/^data:([^,]+)?,/)[1];
                const task = ref.putString(dataURL, 'data_url', { contentType: contentType });
                await task.then(() => {
                    ref.getDownloadURL().then((url) => {
                    console.log(url);
                    });
                });
            };
            
            reader.readAsDataURL(data);
        }
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
            pic: ["https://photos.zillowstatic.com/fp/098f32fc93e3b6b15cf6e2e22332426d-uncropped_scaled_within_1536_1152.webp", "https://photos.zillowstatic.com/fp/203fa4c434461888f63672f39817600a-uncropped_scaled_within_1536_1152.webp", "https://photos.zillowstatic.com/fp/33078d5fa58732d0f0f3af76c9716820-uncropped_scaled_within_1536_1152.webp", "https://photos.zillowstatic.com/fp/115685a3cad663798b7682adab5d6a2e-uncropped_scaled_within_1536_1152.webp", "https://photos.zillowstatic.com/fp/69965fc0d7d7aa63d491160ea30a6cb0-uncropped_scaled_within_1536_1152.webp", "https://photos.zillowstatic.com/fp/b44ab46a610ac30251555d73a13f671c-uncropped_scaled_within_1536_1152.webp"],
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
                {/* <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100, marginLeft:20}}/> */}
                
                <Pressable onPress={uploadImage}>
                    <View style={{backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <View style={{width:width, backgroundColor:'lightgray', height:height, borderBottomLeftRadius:20, borderBottomRightRadius:20, justifyContent:'center', alignItems:'center'}}>
                            <Ionicons name='images' size={150} color={"white"} />
                            <Text style={{color:'white', fontSize:20}}>Tap to add pictures</Text>
                        </View>
                        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {
                            imageUrls.map((item, index)=>(
                                <View key={index}>
                                    <Image source={{uri:item.uri}} style={{height:height, width:width}}/>
                                </View>
                            ))
                        }
                        </ScrollView>
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

                <Pressable onPress={()=> {addPosts("AllPosts", title, price, details, description, coordinates)}}>
                    <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Add a post (for testing purposes only)</Text>
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