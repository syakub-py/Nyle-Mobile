import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
    TextInput,
    Image,
    Pressable,
    Dimensions,
    Alert,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import faker from 'faker';
import {firestore, getstorage} from './Components/Firebase';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';

const {width} = Dimensions.get("window");
const height = width*1;

export default function AddPost({route}){
    let randomNumber = Math.floor(Math.random() * 100);
    faker.seed(randomNumber);

    const currencies = [
        { label: 'Bitcoin', value: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579" },
        { label: 'Ethereum', value: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880" },
        { label: 'Doge Coin', value: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256" },
        { label: 'USD', value: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389" },
        { label: 'Solana', value: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422" },
    ]

    const [refresh, setRefreshing] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [price, setPrice] = React.useState(randomNumber.toString());
    const [coordinates, setCoordinates] = React.useState({latitude: 0, longitude: 0,});
    const [animating, setAnimating] = React.useState(false);
    const [category, setCategory] = React.useState("All");
    const categories = [{Label:"All", Value:"All"},{Label:"Tech", Value:"Tech"}, {Label:"Auto", Value:"Auto"}, {Label:"Homes", Value:"Homes"}, {Label:"Bikes", Value:"Bikes"}, {Label:"Bike Parts", Value:"Bike Parts"}, {Label:"Jewelry", Value:"Jewelry"},{Label:"Retail/Wholesale", Value:"Retail/Wholesale"}]

    //urls for the phone
    const [imageUrls, setImageUrls] = React.useState([]);
    const [currency, setCurrency] = React.useState({label:'', value:''});
    const [isFocus, setIsFocus] = React.useState(false);    


    const SelectImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4, 3],
          quality: 1,
          allowsMultipleSelection: true
        });
      
        if (!result.canceled) {
            const currentImageUrls = [...imageUrls];
            const fileJson = result.assets;
            fileJson.forEach((element)=>{
                currentImageUrls.push(element.uri)
            })
            setImageUrls(currentImageUrls);
        }
    };
          

    const upload = async (array) => {
        const UrlDownloads= [];
        setAnimating(true)
        try {
          for (const element of array) {
            const filename = element.split("/").pop();
            const response = await fetch(element);
            const blob = await response.blob();
            const storageRef = getstorage.ref().child(`images/${title}/${filename}`);
            await storageRef.put(blob);
            console.log("Image uploaded successfully!");
            const url = await storageRef.getDownloadURL();
            UrlDownloads.push(url);
          }
          console.log("All images uploaded successfully!");
          console.log(UrlDownloads)
          setAnimating(false)

          return UrlDownloads;
        } catch (error) {
          console.error(error);
          return [];
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

    const clear =() =>{
        setTitle('');
        setDescription('');
        setDetails('');
        setPrice('');
        setCoordinates({latitude: 0, longitude: 0,});
        setImageUrls([]);
        onRefresh();
    }

    const deleteImages = (index) =>{
        const newArray = imageUrls
        newArray.splice(index, 1)
        setImageUrls(newArray)
        onRefresh();
    }

    const addPosts = async (collectionPath, title, price, details, description, coordinates) =>{
        if (!collectionPath) {
            throw new Error('Error: collection name cannot be empty');
        }
        const UrlList= await upload(imageUrls)
        return firestore.collection(collectionPath).doc(title).set({
            id:randomNumber,
            title: title,
            price: price,
            PostedBy: route.params.username,
            currency: currency.value,
            details: details,
            description: description,
            pic: UrlList,
            profilePic: route.params.profilePicture,
            coordinates: coordinates,
            views: 0,
            likes: [],
            sold: "false",
            category:category,
            date: new Date().toLocaleString(),
        })
        .then(ref => {
            console.log('Added document with ID: ' + title);
            Alert.alert("Post added")
            clear();
        })
        .catch(error => {
            console.log('Error adding document: ', error);
        });
    }

    const renderCurrencyItem = (item) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{uri: item.value}} style={{ width: 30, height: 30, margin:10, borderRadius:50 }} />
                <Text>{item.label}</Text>
            </View>
        );
    };


    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            <ScrollView contentContainerStyle={{paddingBottom:60}} refreshControl={<RefreshControl refreshing ={refresh} onRefresh={onRefresh}/>} >
                {
                    (animating)?(
                        <View>
                            <ActivityIndicator size="large" color="black" animating={animating} />
                        </View>
                    ):(
                        <View>

                        </View>
                    )
                }
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
                                    <Pressable style={{zIndex:1}} onPress={()=>{deleteImages(k)}}>
                                        <View style={styles.shadowBox}>
                                            <View style={styles.circle}>
                                                <Ionicons name='remove-outline' color={'white'} size={15} style={{elevation:1}}/>
                                            </View>
                                        </View>
                                    </Pressable>
                                    <Image source={{uri:i}} style={{height:50, width:50, margin:10, borderRadius:10, alignContent:'center'}}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>

                {
                    (imageUrls.length === 0)? (
                        <Pressable onPress={SelectImages} style={{justifyContent:'center', alignItems:'center'}}>
                            <View style={{height:height, width:width, backgroundColor:'whitesmoke', justifyContent:'center', alignItems:'center'}}>
                                <Ionicons name='images-outline' size={80} color={'lightgray'}/>
                            </View>
                        </Pressable>
                    ):(
                    <Pressable onPress={SelectImages} style={{justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:70, backgroundColor:'black', height:70, borderRadius:40, justifyContent:'center', alignItems:'center'}}>
                            <Ionicons name='add-outline' size={40} color={'white'}/>
                        </View>
                    </Pressable>
                    )
                }
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:10}}>Title</Text>
                    <TextInput style={styles.textinput} onChangeText = {(text)=>{setTitle(text)}} value={title}/>
                </View>

                <View>
                    <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:10}}>Category</Text>

                <Dropdown
                    style={{
                        height: 50,
                        borderRadius: 10,
                        paddingHorizontal: 16,
                        backgroundColor: 'whitesmoke',
                        marginLeft:35, marginRight:35
                    }}
                    placeholderStyle={{}}
                    selectedTextStyle={{}}
                    inputSearchStyle={{
                        borderBottomWidth: 0,
                        backgroundColor: '#f2f2f2',
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        marginHorizontal: 16,
                        marginBottom: 8,
                    }}
                    iconStyle={{
                        width: 20,
                        height: 20,
                        marginRight: 8,
                    }}
                    data={categories}
                    search
                    labelField="Label"
                    valueField="Value"
                    placeholder={'Select item'}
                    searchPlaceholder="Search..."
                    value={category}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                        setCategory(item.Value);
                        setIsFocus(false);
                    }}
                />
                </View>
                <View >
                    <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:10}}>Price</Text>
                    <View style={{flexDirection:'row', marginLeft:30}}>
                        <Dropdown
                            style={{
                                height: 50,
                                width: width / 3,
                                borderRadius: 10,
                                paddingHorizontal: 16,
                                backgroundColor: 'whitesmoke',
                            }}
                            placeholderStyle={{}}
                            selectedTextStyle={{}}
                            inputSearchStyle={{
                                borderBottomWidth: 0,
                                backgroundColor: '#f2f2f2',
                                borderRadius: 20,
                                paddingHorizontal: 12,
                                marginHorizontal: 16,
                                marginBottom: 8,
                            }}
                            iconStyle={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                            }}
                            data={currencies}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder={'Select item'}
                            searchPlaceholder="Search..."
                            value={currency}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            renderItem={renderCurrencyItem}
                            onChange={(item) => {
                                setCurrency(item);
                                setIsFocus(false);
                            }}
                        />

                        <TextInput style={{backgroundColor:'whitesmoke', color:'gray', marginLeft:35, marginRight:35,fontSize:15,fontWeight:'600',height:50,borderRadius:10,paddingHorizontal:15, width:width/2.5}} onChangeText={(text)=>setPrice(text)}/>
                    </View>
                </View>

                <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:10}}>Location</Text>
                <View style={{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
                    <MapView style={{height:"100%", width:"100%"}} initialCamera={{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress={dropMarker}>
                        <Marker coordinate={coordinates}/>
                    </MapView>
                </View>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:10}}>Details</Text>
                    <TextInput multiline style={{backgroundColor:'whitesmoke', color:'gray', marginLeft:35, marginRight:35, fontSize:15,fontWeight:'600',height:200,borderRadius:10,paddingHorizontal:15,}} onChangeText={(text)=>setDetails(text)}/>
                </View>

                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:10,}}>Description</Text>
                    <TextInput multiline style={{backgroundColor:'whitesmoke', color:'gray', marginLeft:35, marginRight:35, fontSize:15, fontWeight:'600', height:200,borderRadius:10,paddingHorizontal:15,}} defaultValue ={description} onChangeText={(text)=>setDescription(text)}/>
                </View>

                <Pressable onPress={()=> {addPosts("AllPosts", title, price, details, description, coordinates)}}>
                    <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style={{margin:10, color:"white", fontWeight:"bold"}}>Add post</Text>
                    </View>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textinput:{
        backgroundColor:'whitesmoke',
        marginLeft:35,
        marginRight:35,
        fontSize:15,
        height:50,
        borderRadius:10,
        paddingHorizontal:15,
    },
    shadowBox: {
        position: 'absolute',
        left: 5,
        top: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex:1
      },
      circle: {
        backgroundColor: 'red',
        height: 20,
        width: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
  });