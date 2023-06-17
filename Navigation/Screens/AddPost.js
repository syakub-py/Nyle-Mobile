import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
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
import _ from "lodash"
import DropdownInput from './Components/AddPostDropdown';
import { CustomTextInput, CustomTextWithInput } from './Components/CustomText';

const {width} = Dimensions.get("window");
const height = width * 1;

/**
 * 
 * @param {*} param0: {profilePicture: url of the profile, username: current username}
 * @returns 
 */

const currencies = [
    { label: 'Bitcoin', value: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579" },
    { label: 'Ethereum', value: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880" },
    { label: 'Doge Coin', value: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256" },
    { label: 'USD', value: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389" },
    { label: 'Solana', value: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422" },
]

export default function AddPost({route}) {
    let randomNumber = Math.floor(Math.random() * 100);
    faker.seed(randomNumber);

    const [refresh, setRefreshing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');
    const [price, setPrice] = useState(randomNumber.toString());
    const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0,});
    const [animating, setAnimating] = useState(false);
    const [category, setCategory] = useState("All");
    const [VIN, setVIN] = useState("");
    const [mileage, setMileage] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [SQFT, setSQFT] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");

    const categories = [{Label:"All", Value:"All"},{Label:"Tech", Value:"Tech"}, {Label:"Auto", Value:"Auto"}, {Label:"Homes", Value:"Homes"}, {Label:"Bikes", Value:"Bikes"}, {Label:"Bike Parts", Value:"Bike Parts"}, {Label:"Jewelry", Value:"Jewelry"},{Label:"Retail/Wholesale", Value:"Retail/Wholesale"}]

    //urls for the phone
    const [imageUrls, setImageUrls] = useState([]);
    const [currency, setCurrency] = useState({label:'', value:''});
    const [isFocus, setIsFocus] = useState(false);

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
            fileJson.forEach((element) => {
                currentImageUrls.push(element.uri)
            })
            setImageUrls(currentImageUrls);
        }
    };

    const upload = async (array) => {
        const UrlDownloads = [];
        setAnimating(true)
        try {
          for (const element of array) {
            const filename = element.split("/").pop();
            const response = await fetch(element);
            const blob = await response.blob();
            const storageRef = getstorage.ref().child(`images/${title}/${filename}`);
            await storageRef.put(blob);
            const url = await storageRef.getDownloadURL();
            UrlDownloads.push(url);
          }
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

    const dropMarker = (event) => {
        const coordinate = event.nativeEvent;
        setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
    } 

    const clear = () => {
        setTitle('');
        setDescription('');
        setDetails('');
        setPrice('');
        setCoordinates({latitude: 0, longitude: 0,});
        setVIN("")
        setMileage("")
        setImageUrls([]);
        setBathrooms("")
        setBedrooms("")
        onRefresh();
    }

    const deleteImages = (index) => {
        const newArray = imageUrls
        newArray.splice(index, 1)
        setImageUrls(newArray)
        onRefresh();
    }

    const createDocument = ({uniqueFields}) => ({
        id: randomNumber,
        title: title,
        price: price,
        PostedBy: route.params.username,
        currency: currency.value,
        description: description,
        pic: UrlList,
        profilePic: route.params.profilePicture,
        coordinates: coordinates,
        views: 0,
        likes: [],
        sold: "false",
        category: category,
        date: new Date().toLocaleString(),
        ...uniqueFields
    })

    const addPosts = async (collectionPath) => {
        if (!collectionPath) throw new Error('Error: collection name cannot be empty');

        await upload(imageUrls)
        let uniqueFields = {};

        if (category === "Auto") {
            uniqueFields = {
                Vin: VIN,
                mileage: mileage,
                make: make,
                model: model
            }
        } else if (category === "Homes") {
            uniqueFields = {
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                SQFT: SQFT
            }
        } else {
            uniqueFields = {
                details: details
            }
        }

        const document = createDocument({uniqueFields});

        return firestore.collection(collectionPath).doc(title).set(document)
            .then(ref => {
                Alert.alert("Post added")
                clear();
            })
            .catch(error => {
                console.log('Error adding document: ', error);
            });
    }

    const renderCurrencyItem = (item) => {
        return (
            <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source = {{uri: item.value}} style = {{ width: 30, height: 30, margin:10, borderRadius:50 }} />
                <Text>{item.label}</Text>
            </View>
        );
    };

    const isImageUrls = () => {
        if (_.isEmpty(imageUrls)) {
            return (
                <Pressable onPress = {SelectImages} style = {{justifyContent:'center', alignItems:'center'}}>
                    <View style = {{height:height, width:width, backgroundColor:'whitesmoke', justifyContent:'center', alignItems:'center'}}>
                        <Ionicons name ='images-outline' size = {80} color = {'lightgray'}/>
                    </View>
                </Pressable>
            )
        }
        
        return (
            <Pressable onPress = {SelectImages} style = {{justifyContent:'center', alignItems:'center'}}>
                <View style = {{width:70, backgroundColor:'black', height:70, borderRadius:40, justifyContent:'center', alignItems:'center'}}>
                    <Ionicons name ='add-outline' size = {40} color = {'white'}/>
                </View>
            </Pressable> 
        )
    }

    const renderDetailsText = () => {
        if ((category === "Homes" || category === "Auto"))  return  <View/>

        return (
            <View> 
                <CustomTextWithInput 
                    text="Details" 
                    onChangeText={(text) => setDetails(text)} 
                    multiline
                    height={200}
                />
            </View>
        )
    }

    const renderHomesSection = () => {
        if (category !== "Homes") return <View/>

        return (
            <View>
                <CustomTextWithInput text="Bedrooms" onChangeText={(text) => setBedrooms(text)} multiline />
                <CustomTextWithInput text="Bathrooms" onChangeText={(text) => setBathrooms(text)} multiline />
                <CustomTextWithInput text="Square footage" onChangeText={(text) => setSQFT(text)} multiline />
            </View>
        )
    }

    const renderAutoSection = () => {
        if (category !== "Auto") return <View/>

        return (
            <View>
                <CustomTextWithInput text="Make" onChangeText={(text) => setMake(text)} />
                <CustomTextWithInput text="Model" onChangeText={(text) => setModel(text)} />
                <CustomTextWithInput text="Mileage" onChangeText={(text) => setMileage(text)} />
                <CustomTextWithInput text="VIN" onChangeText={(text) => setVIN(text)} />
            </View>
        )
    }

    const isAnimating = () => {
        if (!animating) return <View/>
        return (
            <View>
                <ActivityIndicator size = "large" color = "black" animating = {animating} />
            </View>
        )
    }

    return (
        <SafeAreaView style = {{backgroundColor:'white'}}>
            <ScrollView contentContainerStyle = {{paddingBottom:60}} refreshControl = {<RefreshControl refreshing = {refresh} onRefresh = {onRefresh}/>} >

                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator = {false}>
                {
                    imageUrls.map((item, index) =>(
                        <View key = {index}>
                            <Image source = {{uri:item}} style = {{height:height, width:width}}/>
                        </View>
                    ) )
                }
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator = {false} style = {{alignSelf:'center'}}>
                    <View style = {{flexDirection:'row', alignItems:'center'}}>
                        {
                            imageUrls.map((i, k) =>(
                                <Pressable key = {k}>
                                    <Pressable style = {{zIndex:1}} onPress = {() => {deleteImages(k)}}>
                                        <View style = {styles.shadowBox}>
                                            <View style = {styles.circle}>
                                                <Ionicons name ='remove-outline' color = {'white'} size = {15} style = {{elevation:1}}/>
                                            </View>
                                        </View>
                                    </Pressable>
                                    <Image source = {{uri:i}} style = {{height:50, width:50, margin:10, borderRadius:10, alignContent:'center'}}/>
                                </Pressable>
                            ))
                        }
                    </View>
                </ScrollView>

                {isImageUrls()}

                <View>
                    <CustomTextWithInput 
                        text="Title" 
                        onChangeText={(text) => setTitle(text)} 
                        value={title}
                    />
                </View>

                <View>
                    <Text style = {{fontSize:25, fontWeight:'bold', color:'black',margin:10}}>Category</Text>

                    <DropdownInput
                        data={categories}
                        labelField = "Label"
                        valueField = "Value"
                        placeholder = "Select item"
                        onChange = {(item) => {
                            setCategory(item.Value);
                            setIsFocus(false);
                        }}
                        value = {category}
                        customStyle = {{
                            marginLeft:35, 
                            marginRight:35
                        }}
                    />

                </View>
                <View >
                    <Text style = {{fontSize:25, fontWeight:'bold', color:'black',margin:10}}>Price</Text>
                    <View style = {{flexDirection:'row', marginLeft:30}}>
                    <DropdownInput
                        data={currencies}
                        labelField = "label"
                        valueField = "value"
                        placeholder = "Select a currency"
                        onChange={(item) => {
                            setCurrency(item);
                            setIsFocus(false);
                        }}
                        value = {currency}
                        renderItem = {renderCurrencyItem}
                        customStyle = {{
                            width: Dimensions.get('window').width / 3
                        }}
                    />
                    
                    <CustomTextInput onChangeText={(text) => setPrice(text)} width={width/2.5}/>

                    </View>
                </View>

                <CustomText text="Location" />
                <View style = {{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
                    <MapView style = {{height:"100%", width:"100%"}} initialCamera = {{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress = {dropMarker}>
                        <Marker coordinate = {coordinates}/>
                    </MapView>
                </View>

                {renderDetailsText()}
                {renderHomesSection()}

                {renderAutoSection()}

                <View>
                    <CustomTextWithInput 
                        text="Description" 
                        onChangeText={(text) => setDescription(text)} 
                        multiline={true} 
                        height={200} 
                        value={description} 
                    />
                </View>

                {isAnimating()}

                <Pressable onPress = {() => {addPosts("AllPosts")}}>
                    <View style = {{marginBottom:20, marginLeft:10, marginRight:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style = {{margin:10, color:"white", fontWeight:"bold"}}>Add post</Text>
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
